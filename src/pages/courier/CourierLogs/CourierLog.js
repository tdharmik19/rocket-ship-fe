import React, {useState} from 'react';
import PageWithSidebar from '../../../common/components/page-with-sidebar/PageWithSidebar';
import { Link } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import { noData } from '../../../common/images';

function CourierLog() {
    const tempdata = [
        { courierName: 'Xpressbees Surface', createdAt: '08/06/2024 13:46:26', status: 'Activated', user: 'Tech Easy' },
        { courierName: 'Xpressbees Surface', createdAt: '08/06/2024 13:46:17', status: 'Deactivated', user: 'Tech Easy' },
        { courierName: 'Xpressbees Surface', createdAt: '08/06/2024 13:42:13', status: 'Activated', user: 'Tech Easy' },
        { courierName: 'Xpressbees Surface', createdAt: '08/06/2024 13:41:57', status: 'Deactivated', user: 'Tech Easy' },
        { courierName: 'India Post', createdAt: '08/06/2024 13:20:30', status: 'Activated', user: 'Tech Easy' },
        { courierName: 'India Post', createdAt: '08/06/2024 13:06:09', status: 'Deactivated', user: 'Tech Easy' },
        { courierName: 'India Post', createdAt: '08/06/2024 13:06:09', status: 'Deactivated', user: 'Tech Easy' },
      ];
    const [data, setData] = useState(tempdata);
    const [totalData, setTotalData] = useState([]);
    const [per_page, setPerPage] = useState(15);
    const [page, setPage] = useState(1);
    const handlePageChange = (page) => {
        setPage(page);
      }
    
      const handlePerPageChange = (perPage) => {
        setPerPage(perPage);
      }

      const currentPageData = data.slice((page - 1) * per_page, page * per_page);

  return (
    <PageWithSidebar>
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Settings - Courier Selection</h2>
      <div className="bg-gray-100 flex flex-row p-3 rounded-sm">
        <div className="w-1/4 flex">
            <div className="w-64">
            <div className="px-4 py-6">
                <ul className="space-y-2">
                <li>
                    <Link
                    to="/user-couriers"
                    className="rounded-md px-4 py-2 block font-medium"
                    >
                    Courier Priority
                    </Link>
                </li>
                <li>
                    <Link
                    to="/user"
                    className="text-gray-600 hover:bg-gray-100 rounded-md px-4 py-2 block font-medium"
                    >
                    Courier Selection
                    </Link>
                </li>
                <li>
                    <Link
                    to="/user-couriers"
                    className="text-gray-600 hover:bg-gray-100 rounded-md px-4 py-2 block font-medium"
                    >
                    Courier Rules
                    </Link>
                </li>
                <li className='bg-white'>
                    <Link
                    to="/courier-log"
                    className="text-gray-600 hover:bg-gray-100 rounded-md px-4 py-2 block font-medium"
                    >
                    Courier Activity Logs
                    </Link>
                </li>
                </ul>
            </div>
            </div>
        </div>

            <div className="w-3/4 overflow-x-auto">
            <div className="bg-white shadow rounded-lg">
                <div className="flex justify-between mb-4">
                    <div className="flex flex-row items-center w-full border border-l-2 bg-[#FAFAFA]">
                        <div className="p-2 h-full font-semibold text-sm border-r-2 w-1/12 flex-grow">Courier Name</div>
                        <div className="p-2 h-full font-semibold text-sm border-r-2 w-2/12 flex-grow">Created At</div>
                        <div className="p-2 h-full font-semibold text-sm border-r-2 w-1/12 flex-grow">Status</div>
                        <div className="p-2 h-full font-semibold text-sm border-r-2 w-[12%] flex-grow">User</div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col justify-between items-center mb-4'>
                {data.length === 0 ? (
                    <div className='pt-16 mb-12 w-full flex justify-center items-center flex-col'>
                        <img src={noData} alt="" width={'200px'} />
                        <div className='text-[1.7rem] mt-10 text-[#b54040] font-bold'>No Data Available.</div>
                        <div className='text-[14px] mt-2 font-normal opacity-80'>Please change filters and retry.</div>
                    </div>
                ) : (
                    currentPageData.map((item, index) => (
                        <div className='flex flex-row items-center h-12 w-full border bg-[#FAFAFA]' key={index}>
                            <div className='p-2 h-full font-semibold text-sm w-1/12 flex-grow'>{item.courierName}</div>
                            <div className='p-2 h-full font-semibold text-sm border-l-2 border-r-2 w-2/12 flex-grow'>{item.createdAt}</div>
                            <div className='p-2 h-full font-semibold text-sm border-r-2 w-1/12 flex-grow'>{item.status}</div>
                            <div className='p-1 h-full font-semibold text-sm border-r-2 w-[12%] flex-grow'>{item.user}</div>
                        </div>
                    ))
                )}
            </div>

        {data.length &&
          <div>
            <Pagination page={page} totalData={totalData} setPage={setPage} perPage={per_page} data={data} handlePageChange={handlePageChange} handlePerPageChange={handlePerPageChange} />
          </div>
          }
        </div>
      </div>
    </div>
    </PageWithSidebar>
  );
}

export default CourierLog;




