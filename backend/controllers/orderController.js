const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all orders with pagination and filtering
const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      userId
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    
    if (userId) {
      where.userId = parseInt(userId);
    }
    
    if (search) {
      where.OR = [
        { orderId: { contains: search } },
        { productName: { contains: search } },
        { user: { username: { contains: search } } }
      ];
    }

    // Get orders with user information
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: parseInt(limit)
    });

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    // Transform data for frontend
    const transformedOrders = orders.map(order => ({
      id: order.id.toString(),
      orderId: order.orderId,
      userId: order.user.id.toString(),
      username: order.user.username,
      productName: order.productName,
      amount: parseFloat(order.amount),
      amountPerOrder: parseFloat(order.amountPerOrder),
      status: order.status.toLowerCase(),
      selectedProducts: JSON.parse(order.selectedProducts),
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }));

    res.json({
      success: true,
      data: {
        orders: transformedOrders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single order by ID
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const transformedOrder = {
      id: order.id.toString(),
      orderId: order.orderId,
      userId: order.user.id.toString(),
      username: order.user.username,
      productName: order.productName,
      amount: parseFloat(order.amount),
      amountPerOrder: parseFloat(order.amountPerOrder),
      status: order.status.toLowerCase(),
      selectedProducts: JSON.parse(order.selectedProducts),
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    };

    res.json({
      success: true,
      data: transformedOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      productName,
      amount,
      amountPerOrder,
      selectedProducts,
      notes
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!orderId || !productName || !amount || !amountPerOrder || !selectedProducts) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Use the provided order ID
    const finalOrderId = orderId;

    // Check if orderId already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderId: finalOrderId }
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'Order ID already exists'
      });
    }

    // Get user's current balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentBalance = parseFloat(user.balance || 0);
    const orderAmount = parseFloat(amount);

    // Check if user has sufficient balance
    if (currentBalance < orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance. Please top up your account.'
      });
    }

    // Create order and update user balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderId: finalOrderId,
          userId,
          productName,
          amount: orderAmount,
          amountPerOrder: parseFloat(amountPerOrder),
          selectedProducts: JSON.stringify(selectedProducts),
          notes,
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      // Update user's balance
      const newBalance = currentBalance - orderAmount;
      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance }
      });

      return order;
    });

    const order = result;

    const transformedOrder = {
      id: order.id.toString(),
      orderId: order.orderId,
      userId: order.user.id.toString(),
      username: order.user.username,
      productName: order.productName,
      amount: parseFloat(order.amount),
      amountPerOrder: parseFloat(order.amountPerOrder),
      status: order.status.toLowerCase(),
      selectedProducts: JSON.parse(order.selectedProducts),
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        ...transformedOrder,
        userBalance: currentBalance - orderAmount
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

      // Handle balance refund for cancelled orders
  let balanceUpdate = null;
  if (status.toUpperCase() === 'CANCELLED' && order.status !== 'CANCELLED') {
    // Only refund if the order wasn't already cancelled
    const orderAmount = parseFloat(order.amount);
    const currentUser = await prisma.user.findUnique({
      where: { id: order.userId },
      select: { balance: true }
    });
    
    if (currentUser) {
      const currentBalance = parseFloat(currentUser.balance || 0);
      const newBalance = currentBalance + orderAmount;
      
      await prisma.user.update({
        where: { id: order.userId },
        data: { balance: newBalance }
      });
      
      balanceUpdate = newBalance;
    }
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status: status.toUpperCase() },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

    const transformedOrder = {
      id: updatedOrder.id.toString(),
      orderId: updatedOrder.orderId,
      userId: updatedOrder.user.id.toString(),
      username: updatedOrder.user.username,
      productName: updatedOrder.productName,
      amount: parseFloat(updatedOrder.amount),
      amountPerOrder: parseFloat(updatedOrder.amountPerOrder),
      status: updatedOrder.status.toLowerCase(),
      selectedProducts: JSON.parse(updatedOrder.selectedProducts),
      notes: updatedOrder.notes,
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString()
    };

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        ...transformedOrder,
        ...(balanceUpdate !== null && { userBalance: balanceUpdate })
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      amount,
      amountPerOrder,
      selectedProducts,
      notes,
      status
    } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Build update data
    const updateData = {};
    if (productName) updateData.productName = productName;
    if (amount) updateData.amount = parseFloat(amount);
    if (amountPerOrder) updateData.amountPerOrder = parseFloat(amountPerOrder);
    if (selectedProducts) updateData.selectedProducts = JSON.stringify(selectedProducts);
    if (notes !== undefined) updateData.notes = notes;
    if (status) {
      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      updateData.status = status.toUpperCase();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    const transformedOrder = {
      id: updatedOrder.id.toString(),
      orderId: updatedOrder.orderId,
      userId: updatedOrder.user.id.toString(),
      username: updatedOrder.user.username,
      productName: updatedOrder.productName,
      amount: parseFloat(updatedOrder.amount),
      amountPerOrder: parseFloat(updatedOrder.amountPerOrder),
      status: updatedOrder.status.toLowerCase(),
      selectedProducts: JSON.parse(updatedOrder.selectedProducts),
      notes: updatedOrder.notes,
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString()
    };

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: transformedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Refund balance if order is not cancelled (since cancelled orders already refunded)
    if (order.status !== 'CANCELLED') {
      const orderAmount = parseFloat(order.amount);
      const currentUser = await prisma.user.findUnique({
        where: { id: order.userId },
        select: { balance: true }
      });
      
      if (currentUser) {
        const currentBalance = parseFloat(currentUser.balance || 0);
        const newBalance = currentBalance + orderAmount;
        
        await prisma.user.update({
          where: { id: order.userId },
          data: { balance: newBalance }
        });
      }
    }

    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
    const processingOrders = await prisma.order.count({ where: { status: 'PROCESSING' } });
    const completedOrders = await prisma.order.count({ where: { status: 'COMPLETED' } });
    const cancelledOrders = await prisma.order.count({ where: { status: 'CANCELLED' } });

    // Calculate total revenue
    const completedOrdersData = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true }
    });

    const totalRevenue = completedOrdersData.reduce((sum, order) => {
      return sum + parseFloat(order.amount);
    }, 0);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    const transformedRecentOrders = recentOrders.map(order => ({
      id: order.id.toString(),
      orderId: order.orderId,
      username: order.user.username,
      amount: parseFloat(order.amount),
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString()
    }));

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders: transformedRecentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats
};
