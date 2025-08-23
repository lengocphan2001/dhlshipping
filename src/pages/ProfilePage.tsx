import React from 'react';
import Layout from '../components/layout/Layout';
import UserProfile from '../components/ui/UserProfile';

const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <UserProfile />
    </Layout>
  );
};

export default ProfilePage;
