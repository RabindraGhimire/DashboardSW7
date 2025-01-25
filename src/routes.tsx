import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdGroup,
} from 'react-icons/md';

// Admin Components
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Packages from 'views/admin/dataTables/packages';
import Orders from 'views/admin/orders/orders';

// Auth Components
import SignInCentered from 'views/auth/signIn';

const routes = [
  // Public Routes
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    isPrivate: false,
  },

  // Admin Routes
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    isPrivate: false,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: (
      <Icon
        as={MdGroup}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    isPrivate: true,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    isPrivate: true,
  },
  {
    name: 'Packages',
    layout: '/admin',
    path: '/packages',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Packages />,
    isPrivate: false,
  },
  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <Orders />,
    isPrivate: true,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    isPrivate: true,
  },
];

export default routes;
