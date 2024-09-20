import React, {useState,useEffect} from 'react'
import { CustomMultiSelect } from '../../../common/components';


const Product = ({show,onClose}) => {
    const [showDangerGoodsInfo, setShowDangerGoodsInfo] = useState('Select');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [categories] = useState([]);

    const [isShow,setIsShow] = useState(show)
    const dangerGoodsInfo = [
        {label:"Select",value:"Select"},
        {label:"Yes",value:"Yes"},
        {label:"No",value:"No"}
    ]

    useEffect(() => {
        setIsShow(show);
      }, [show]);
    
      const handleClose = () => {
        setIsShow(false);
        onClose(); 
      };
  
      const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };
    
      const handleSearchChange = (e) => {
        setSearch(e.target.value);
      };

  return (
    <div className="relative w-full border-2 rounded-md p-3">
    <div className="flex flex-row justify-between items-center mb-2">
      <label className="block text-gray-500 font-semibold mb-2">Product Category</label>
      <button onClick={() => handleClose()}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      </div>
      <div className="w-64">
      <button
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-left"
      >
        Product Category
        <span className="float-right font-semibold">{isDropdownOpen ? '▲' : '▼'}</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute inset-x-0 top-full -mt-3 ml-3 w-64 bg-white border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-64 border-b rounded-md border-gray-300"
            placeholder="Search Product Category"
            value={search}
            onChange={handleSearchChange}
          />
          <div>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {category}
                </div>
              ))
            ) : (
              <div className="px-2 py-2 text-gray-500">No Product Category Found</div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Product