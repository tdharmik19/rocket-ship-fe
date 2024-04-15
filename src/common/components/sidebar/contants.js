import { bill, book, dashboard, help, home, homeActive, manage, order, settings,tool, user,weight,return1, boost, newHome } from '../../icons/sidebar-icons';
import { logout } from './utils';

const is_admin = localStorage.getItem('is_admin')
const user_id = localStorage.getItem('user_id')
const is_company = localStorage.getItem('is_company')

export const sidebarLinks = [
  {
    title: 'Home',
    path: '/seller/home',
    icon: newHome,
    hoverIcon: newHome,
  },
  parseInt(is_company) && {
    title: 'Add User',
    path: '/signup-user',
    icon: user,
    hoverIcon: user,
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: dashboard,
    hoverIcon: dashboard,
  },
  {
    title: 'Truck Booking',
    // path: '/book',
    icon: book,
    hoverIcon: book,
    subMenuOptions:[
      !parseInt(is_admin) &&{
        title:"Book",
        path:"/book"
      },
      !parseInt(is_admin) &&{
        title:"Create Indent",
        path:"/indent"
      },
      !parseInt(is_admin) &&{
        title:"All Indent",
        path:"/all-indent/"+user_id
      },
      parseInt(is_admin) && {
        title:"User Booking",
        path:"/User"
      }
    ].filter(option => option),
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: order,
    hoverIcon: order,
  },
  {
    title: 'Returns',
    path: '/returns',
    icon: return1,
    hoverIcon: return1,
  },
  {
    title: 'Delivery Boost',
    path: '/',
    icon: boost,
    hoverIcon: boost,
  },
  {
    title: 'Weight Management',
    icon: weight,
    hoverIcon: weight,
    subMenuOptions: [
      {
        title: 'Weight Discrepancy',
        path: '/billing-charge-details?page=1&perPage=15&to=&from=&status=0&search=&courier_id=',
      },
      {
        title: 'Weight Freeze',
        path: '/request-weight-freeze?freeze_status=Not%20Requested&serach=&per_page=&page=1&from=&to=&channel_code=',
      },
    ],
  },
  {
    title: 'Setup & Manage',
    icon: manage,
    hoverIcon: manage,
    subMenuOptions: [
      {
        title: 'Channels',
        path: '/',
      },
      {
        title: 'Catalogue',
        path: '/',
      },
      {
        title: 'Courier',
        path: '/',
      },
      {
        title: 'Packaging',
        path: '/',
      },
      {
        title: 'Customers',
        path: '/',
      },
    ],
  },
  {
    title: 'Buyer Experiance',
    icon: user,
    hoverIcon: user,
    subMenuOptions: [
      {
        title: 'Brand Boost',
        path: '/',
      },
      {
        title: 'Brand Communication',
        path: '/',
      },
      {
        title: 'Return & Refunds',
        path: '/',
      },
    ],
  },
  {
    title: 'Billing',
    path: '/statement',
    icon: bill,
    hoverIcon: bill,
  },
  {
    title: 'Tools',
    icon: tool,
    hoverIcon: tool,
    subMenuOptions: [
      {
        title: 'Rate Calculator',
        path: '/rate-calculator',
      },
      {
        title: 'Rate Card',
        path: '/',
      },
      {
        title: 'Pincode Zone Mapping',
        path: '/',
      },
      {
        title: 'Bulk Print Actions',
        path: '/',
      },
      {
        title: 'Reports',
        path: '/',
      },
      {
        title: 'Activity Logs',
        path: '/',
      },
    ],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: settings,
    hoverIcon: settings,
  },
  {
    title: 'Help & Support',
    path: '/',
    icon: help,
    hoverIcon: help,
  },
  {
    title: 'Logout',
    icon: home,
    hoverIcon: homeActive,
    onClick: logout
  },
];
