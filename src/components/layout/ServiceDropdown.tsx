import React from 'react';
import './ServiceDropdown.css';

interface ServiceDropdownProps {
  isOpen: boolean;
}

const ServiceDropdown: React.FC<ServiceDropdownProps> = ({ isOpen }) => {
  const services = [
    {
      id: 'featured',
      title: 'Dịch vụ vận chuyển hàng từ úc về Việt Nam',
      isFeatured: false
    },
    {
      id: 'dropship',
      title: 'Dịch vụ Drop Ship hàng từ Úc về Việt Nam',
      isFeatured: false
    },
    {
      id: 'order',
      title: 'Dịch vụ Order hàng úc chính hãng giá tốt',
      isFeatured: false
    }
  ];

  return (
    <div className={`service-dropdown ${isOpen ? 'open' : ''}`}>
      <div className="dropdown-content">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`service-item ${service.isFeatured ? 'featured' : ''}`}
          >
            <a href={`/services/${service.id}`} className="service-link">
              {service.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDropdown;
