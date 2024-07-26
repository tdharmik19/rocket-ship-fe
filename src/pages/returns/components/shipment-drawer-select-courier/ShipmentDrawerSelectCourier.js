import { useEffect, useState } from 'react';
import { Tabs } from '../../../../common/components';
import ShipmentCourierPartnersTable from './components/ShipmentCourierPartnersTable';
import ShipmentSelfFullfiled from './components/ShipmentSelfFullfiled';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../../../common/loader/Loader';
import { BACKEND_URL } from '../../../../common/utils/env.config';
import { ACCESS_TOKEN } from '../../../../common/utils/config';
import { useNavigate } from 'react-router-dom';

const ShipmentDrawerSelectCourier = ({ orderDetails, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [shipmentsDetails, setShipmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const headers = {             
    'Content-Type': 'application/json',
    'Authorization': ACCESS_TOKEN};
  const tabsData = [
    {
      title: 'All',
      id: 'all',
      panel: (
        <ShipmentCourierPartnersTable
          orderId={orderDetails?.id}
          shipmentDetails={shipmentsDetails || []}
          closeShipmentDrawer={onClose}
        />
      ),
    },
    {
      title: 'Air',
      id: 'air',
      panel: (
        <ShipmentCourierPartnersTable
          orderId={orderDetails?.id}
          shipmentDetails={shipmentsDetails ? shipmentsDetails.filter((detail) => detail.charge_type === "Air") : []}
          closeShipmentDrawer={onClose}
        />
      ),
    },
    {
      title: 'Surface',
      id: 'surface',
      panel: (
        <ShipmentCourierPartnersTable
          orderId={orderDetails?.id}
          shipmentDetails={shipmentsDetails ? shipmentsDetails.filter((detail) => detail.charge_type === "Surface") : []}
          closeShipmentDrawer={onClose}
        />
      ),
    },
    {
      title: 'Local',
      id: 'local',
      panel: (
        <ShipmentCourierPartnersTable
          orderId={orderDetails?.id}
          shipmentDetails={shipmentsDetails}
          closeShipmentDrawer={onClose}
        />
      ),
    },
    {
      title: 'Self-Fullfilled',
      id: 'selfFullfilled',
      panel: <ShipmentSelfFullfiled />,
    },
  ];
  const fetchShipmentDetails = () => {
    axios
      .get(`${BACKEND_URL}/return/${orderDetails?.id}/estimate?user_id=${sessionStorage.getItem('user_id')}`,{headers:headers})
      .then((resp) => {
        if (resp.status === 200) {
          setShipmentDetails(resp?.data);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          sessionStorage.clear()
          navigate('/login');
      } else {
          // eslint-disable-next-line no-console
          console.error(e);
          toast('Unable to fetch shipment details', { type: 'error' });
          setIsLoading(false);
      }
      });
  };

  useEffect(() => {
    if (!shipmentsDetails && orderDetails?.id && isOpen) {
      fetchShipmentDetails();
    }
  }, [orderDetails?.id, isOpen]);

  return (
    <div className="mt-3 h-full">
      {isLoading && <Loader/>}
      <Tabs tabs={tabsData} tabClassNames={'px-6 text-[#888]'} />
    </div>
  );
};

export default ShipmentDrawerSelectCourier;
