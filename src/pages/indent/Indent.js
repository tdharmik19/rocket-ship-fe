import { useEffect, useRef, useState, useMemo } from 'react';
import PageWithSidebar from '../../common/components/page-with-sidebar/PageWithSidebar';
import { cityList } from '../book-truck/cities';
import { CustomMultiSelect, Field, Loader } from '../../common/components';
import { materialTypes, truckTypes, weights, weightTypes } from './data';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../common/utils/env.config';
import moment from 'moment';
import { modifyFlag, modifyId } from './Allindent';
import { id_user } from '../log-in/LogIn';
import { ACCESS_TOKEN } from '../../common/utils/config';
import Address from './Address';
import Autosuggest from 'react-autosuggest';
import truck from '../../common/images/truck.png';
import lcvTruck from '../../common/images/lcv_truck.png';
import hyva from '../../common/images/hyva.png';
import container from '../../common/images/container.png';
import trailer from '../../common/images/trailer.png';

export let info = [];

const Indent = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [truckTypes, setTruckTypes] = useState(null);
  const [materialTypes, setMaterialTypes] = useState(null);
  const is_company = sessionStorage.getItem('is_company');
  const id_user = sessionStorage.getItem('user_id');
  const company_id = sessionStorage.getItem('company_id');
  const id = is_company == 1 ? company_id : id_user;
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [bgColor, setBgColor] = useState(false);
  const data = location.state?.data || {};
  console.log('Dataaaaaa', data);
  // console.log("Dataaaaaaaa",props.location.state.targetPrice)
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const headers = {             
    'Content-Type': 'application/json',
    'Authorization': ACCESS_TOKEN};
  // const [id,setId] = useState(1)
  const [isValidPinCode, setIsValidPincode] = useState(true);
  const [values, setValues] = useState({ pincode: '', destinationPincode: '' });
  const [sourcePin, setSourcePin] = useState(data?.from_pincode || '');
  const [destinationPin, setDestinationPin] = useState(data?.to_pincode || '');
  // const [selectedCity, setSelectedCity] = useState({
  //     source: data?.source_id || '',
  //     destination: data?.destination_id || '',
  //     source_id:'',
  //     destination_id:''
  // })
  const [selectedCity, setSelectedCity] = useState({
    source: `${data?.from_area || ''} ${data?.from_city || ''} ${data?.from_state || ''} ${
      data?.from_country || ''
    }`,
    destination:
      `${data?.to_area || ''} ${data?.to_city || ''} ${data?.to_state || ''} ${data?.to_country || ''}` || '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    source: false,
    destination: false,
  });
  const [truckType, setTruckType] = useState(data?.truck_type_id || 'Select Truck Type');
  const [materialType, setMaterialType] = useState(data?.material_type_id || 'Select Material Type');
  const [tons, setTons] = useState(data?.weight_type || 'Select Weight Type');
  const [targetPrice, setTargetPrice] = useState(data?.customer_price || null);
  const [targetWeight, setTargetWeight] = useState(data?.weight || null);
  const [pkgs, setPkgs] = useState(data?.pkgs || null);
  const [isLoading, setIsLoading] = useState(false);
  const [pickUpDate, setPickUpDate] = useState({
    date: data?.created_date
      ? moment(data.created_date).format('YYYY-MM-DD')
      : moment(new Date()).format('YYYY-MM-DD'),
    time: data?.created_date ? moment(data.created_date).format('HH:mm') : moment(new Date()).format('HH:mm'),
  });
  const [shipmentDetails, setShipmentDetails] = useState({
    type: 'ftl',
  });

  const [truckDimention, setTruckDimention] = useState({
    length: 0,
    width: 0,
    height: 0,
  });

  const getTruckType = async () => {
    setLoading(true);
    try {
      const resposne = await axios.get(`${BACKEND_URL}/trucktype/get_truck_types/?created_by=${company_id}`,{ headers:headers });
      setTruckTypes(resposne.data);
      console.log(resposne.data);
    } catch (err) {
      toast(`There is error while fetching data`, { type: 'error' });
      if (err.response && err.response.status === 401) {
        sessionStorage.clear()
        navigate('/login');
    } 
    } finally {
      setLoading(false);
    }
  };

  const getMaterialType = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/materialtype/get_material_type/?created_by=${company_id}`,{ headers:headers }
      );
      setMaterialTypes(response.data);
    } catch (err) {
      toast(`There is error while fetching data`, { type: 'error' });
      if (err.response && err.response.status === 401) {
        sessionStorage.clear()
        navigate('/login');
    } 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTruckType();
    getMaterialType();
  }, []);

  const truckTypesData = truckTypes?.map((type) => {
    console.log(type);
    console.log(truckType);
    return {
      label: (
        <div className="flex gap-4">
          <div className="rounded-lg bg-zinc-100 p-2 text-center">
            {type.truck_type === 'Truck' && <img src={truck} className="inline-block h-14" />}
            {type.truck_type === 'LCV' && <img src={lcvTruck} className="inline-block h-14" />}
            {type.truck_type === 'Container' && <img src={container} className="inline-block h-14" />}
            {type.truck_type === 'Trailer' && <img src={trailer} className="inline-block h-14" />}
            {type.truck_type === 'Hyva' && <img src={hyva} className="inline-block h-14" />}
          </div>
          <div>
            <p className="font-bold">
              Type: <span className="font-normal">{type.truck_type}</span>
            </p>
            <p className="font-bold">
              Number: <span className="font-normal">{type.truck_number}</span>
            </p>
            <p className="font-bold">
              Vehical Capacity:
              <span className="font-normal">
                {type.capacity} {type.capacity_type}
              </span>
            </p>
            <p className="font-bold">
              Dimensions: <span className="font-normal">{type.truck_dimension}</span>
            </p>
          </div>
        </div>
      ),
      value: `${type.truck_type} (Capacity ${type.capacity} ${type.capacity_type} + Dimensions ${type.truck_dimension})`,
      truck_id: type.id,
    };
  });

  const materialTypesData = materialTypes?.map((type) => {
    return { label: type.material_type, value: type.material_type, material_id: type.id };
  });

  const [remarks, setRemarks] = useState(data?.remarks || '');
  const [totalKm, setTotalKm] = useState(data?.kilometer || 0);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');

  const [personInfo, setPersonInfo] = useState({
    coordinate_name: data?.coordinator_name || '',
    coordinate_number: data?.coordinator_mobile || '',
  });

  const [contactPersonInfo, setContactPersonInfo] = useState({
    contact_name: '',
  });

  const volumatricWeight =
    useMemo(
      () =>
        (Number(truckDimention?.length || 0) *
          Number(truckDimention?.width || 0) *
          Number(truckDimention?.height || 0)) /
        5000,
      [truckDimention],
    ) || 0;

  const handleTruckDimention = (event) => {
    const { id, value } = event.target;
    setTruckDimention({
      ...truckDimention,
      [id]: value,
    });
  };

  const userName = sessionStorage.getItem('user_name');
  const userOptions = [
    {
      label: 'Yash Khandhediya' + '+91 9033871787',
      value: 'Jay Patel' + '+91 9033871787',
    },
  ];

  const handlePickUpDate = (event) => {
    const { id, value } = event.target;
    setPickUpDate({
      ...pickUpDate,
      [id]: value,
    });
  };

  const handleShipment = (event) => {
    const { name, value } = event.target;
    setShipmentDetails({
      ...shipmentDetails,
      [name]: value,
    });
  };

  const handleKilometer = () => {
    axios
      .get(BACKEND_URL + `/pincode/?pincode1=${sourcePin}&pincode2=${destinationPin}`,{ headers:headers })
      .then((res) => {
        const { distance } = res.data;
        console.log('Total Km', res.data);
        setTotalKm(distance);
      })
      .catch((err) => {
        console.log('Error In fetching Distance', err);
        if (err.response && err.response.status === 401) {
          sessionStorage.clear()
          navigate('/login');
      } 
      });
  };

  useEffect(() => {
    if (sourcePin.length == 6 && destinationPin.length == 6) {
      handleKilometer();
    }
    // else{
    //     setTotalKm(0)
    // }
  }, [sourcePin, destinationPin]);

  useEffect(() => {
    if (searchParams.get('open') === 'true') {
      setPopupVisible(true);
    } else {
      setPopupVisible(false);
    }
  }, [searchParams]);

  function Dropdown({ isOpen, type }) {
    if (!isOpen) return null;

    return (
      <div
        className="absolute z-[1000000] mt-20 flex h-36 w-64 flex-row flex-wrap gap-2 overflow-y-scroll rounded bg-white p-4 shadow-md"
        ref={dropdownRef}>
        {cityList.map((city) => (
          <div
            key={city.city_id}
            className={`cursor-pointer rounded border border-gray-500 px-1.5 text-[12px] hover:border-red-500 hover:text-red-500 ${
              city === selectedCity.city1 && 'bg-red-500 text-white'
            }`}
            onClick={(event) => {
              event.stopPropagation();
              if (type == 'source') {
                setSelectedCity({ ...selectedCity, [type]: city.name, source_id: city.city_id });
              } else {
                setSelectedCity({ ...selectedCity, [type]: city.name, destination_id: city.city_id });
              }
              setIsDropdownOpen({ ...isDropdownOpen, [type]: false });
              console.log('Jayyyyyyy', selectedCity);
            }}>
            {city.name}
          </div>
        ))}
      </div>
    );
  }

  // useEffect (() => {

  // },[])

  useEffect(() => {
    console.log(truckType);
    console.log(materialType);
  }, [truckType]);

  let count = 1;
  useEffect(() => {
    // if (sessionStorage.getItem('is_kyc') == 1) {
    //   if (count == 1) {
    //     toast('Complete Your KYC First', { type: 'error' });
    //     count++;
    //   }
    //   navigate('/seller/home');
    //   return;
    // } else if (sessionStorage.getItem('is_kyc') == 2) {
    //   if (count == 1) {
    //     toast('KYC Verification Is Pending.', { type: 'error' });
    //     count++;
    //   }
    //   navigate('/seller/home');
    //   return;
    // }

    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current?.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = () => {
    console.log('Handling Create Indent API Here');
    // if (!selectedCity.source_id || !selectedCity.destination_id) {
    //     toast("Please Fill Required fields",{type:'error'})
    //     console.error('Source and destination must be selected.');
    //     return; // Exit the function early if validation fails
    // }

    if (sourcePin.length != 6 || destinationPin.length != 6) {
      toast('Enter Valid Pincode', { type: 'error' });
      return;
    }
    // else if(remarks == ''){toast('Enter Remarks',{type:'error'});return;}
    else if (totalKm == 0) {
      toast('Enter Kilometers', { type: 'error' });
      return;
    }
    // else if(personInfo?.coordinate_name == ''){toast('Enter Coordinate Name',{type:'error'});return;}
    // else if(personInfo?.coordinate_number == '' || personInfo?.coordinate_number.length != 10){toast('Enter Valid Mobile No',{type:'error'});return;}
    else if (targetPrice == null) {
      toast('Enter Target Price', { type: 'error' });
      return;
    } else if (tons == 'Select Weight Type') {
      toast('Enter Weight Type', { type: 'error' });
      return;
    } else if (materialType == 'Select Material Type') {
      toast('Enter Material Type', { type: 'error' });
      return;
    } else if (truckType == 'Select Truck Type') {
      toast('Enter Truck Type', { type: 'error' });
      return;
    }
    setIsLoading(true);
    const headers = { 'Content-Type': 'application/json', Authorization: ACCESS_TOKEN };
    console.log('Jayyyyyyy', selectedCity, materialType);
    axios
      .post(
        BACKEND_URL + '/indent/create_indent',
        {
          // source_id:parseInt(selectedCity.source_id),
          end_customer_loading_point_id: null,
          loading_point_id: null,
          // destination_id:parseInt(selectedCity.destination_id),
          customer_id: 1,
          end_customer_uploading_point_id: null,
          uploading_point_id: null,
          end_customer_id: null,
          customer_user_id: 1,
          truck_type_id: truckType.truck_id,
          weight_type: tons,
          created_by: id_user,
          material_type_id: materialType.material_id,
          customer_price: parseInt(targetPrice),
          trip_status_id: 1,
          origin_id: 10,
          pkgs: pkgs,
          weight: parseInt(targetWeight),
          pickup_date: pickUpDate.date,
          pickup_time: pickUpDate.time,
          volumetric_weight: volumatricWeight,
          trip_status: 0,
          to_pincode: sourcePin,
          from_pincode: destinationPin,
          from_address_id: fromId,
          to_address_id: toId,
          // remarks:remarks,
          kilometer: totalKm,
          // coordinator_name:personInfo?.coordinate_name,
          // coordinator_mobile:personInfo?.coordinate_number,
          to_area: selectedCity?.destination.split(',')[0],
          to_city: selectedCity?.destination.split(',')[1],
          to_state: selectedCity?.destination.split(',')[2],
          to_country: selectedCity?.destination.split(',')[3],
          from_area: selectedCity?.source.split(',')[0],
          from_city: selectedCity?.source.split(',')[1],
          from_state: selectedCity?.source.split(',')[2],
          from_country: selectedCity?.source.split(',')[3],
          ...(personInfo?.coordinate_name && { coordinator_name: personInfo.coordinate_name }),
          ...(personInfo?.coordinate_number && { coordinator_mobile: personInfo.coordinate_number }),
          ...(remarks && { remarks: remarks }),
        },
        { headers:headers },
      )
      .then((response) => {
        setIsLoading(false);
        console.log('General', response);
        toast('Indent Created Successfully', { type: 'success' });
        navigate('/all-indent/' + id_user);
        //   axios.get(BACKEND_URL + `/indent/get_indents?created_by=${id_user}`).then((response)=>{
        //     console.log("RESPONSE",response,response.data.length);
        //     if(response.data.length > 0){
        //         for(let i=0;i<response.data.length;i++){
        //             info.push(response.data[i]);
        //         }
        //     }
        //     navigate('/all-indent')
        //   }
        //   ).catch((err) => {
        //     console.log("ERRRRRRRR",err)
        //   })
      })
      .catch((error) =>  {
        if (error.response && error.response.status === 401) {
            sessionStorage.clear()
            navigate('/login');
          } else {
            console.error('Error:', error);
            setLoading(false);
            toast('Error in Create Indent', { type: 'error' });
          }
    });
    };

  const handleModify = () => {
    console.log('Handling Modify Indent API Here', selectedCity.source);
    const temp_source = selectedCity.source.charAt(0).toUpperCase() + selectedCity.source.slice(1);
    const temp_dest = selectedCity.destination.charAt(0).toUpperCase() + selectedCity.destination.slice(1);
    let temp_source_id;
    let temp_destination_id;
    const match_source = cityList.find((city) => city.name === temp_source);
    const match_destination = cityList.find((city) => city.name === temp_dest);
    if (match_source) {
      temp_source_id = match_source.city_id;
    }

    if (match_destination) {
      temp_destination_id = match_destination.city_id;
    }

    // if (!temp_source_id || !temp_destination_id) {
    //     toast("Please Fill Required fields",{type:'error'})
    //     console.error('Source and destination must be selected.');
    //     return; // Exit the function early if validation fails
    // }
    console.log('Pin checkkkkkkk', sourcePin, destinationPin);

    if (sourcePin.toString().length != 6 || destinationPin.toString().length != 6) {
      toast('Enter Valid Pincode', { type: 'error' });
      return;
    }
    // else if(remarks == ''){toast('Enter Remarks',{type:'error'});return;}
    else if (totalKm == 0) {
      toast('Enter Kilometers', { type: 'error' });
      return;
    }
    // else if(personInfo?.coordinate_name == ''){toast('Enter Coordinate Name',{type:'error'});return;}
    // else if(personInfo?.coordinate_number == '' || personInfo?.coordinate_number.length != 10){toast('Enter Valid Mobile No',{type:'error'});return;}
    else if (targetPrice == null) {
      toast('Enter Target Price', { type: 'error' });
      return;
    } else if (tons == 'Select Weight Type') {
      toast('Enter Weight Type', { type: 'error' });
      return;
    } else if (materialType == 'Select Material Type') {
      toast('Enter Material Type', { type: 'error' });
      return;
    } else if (truckType == 'Select Truck Type') {
      toast('Enter Truck Type', { type: 'error' });
      return;
    }

    setIsLoading(true);
    // const headers = { 'Content-Type': 'application/json', Authorization: ACCESS_TOKEN };
    console.log('Jayyyyyyy', selectedCity, materialType);
    axios
      .put(
        BACKEND_URL + '/indent/modify_indent',
        {
          id: modifyId,
          // source_id:temp_source_id,
          end_customer_loading_point_id: null,
          loading_point_id: null,
          // destination_id:temp_destination_id,
          customer_id: 1,
          end_customer_uploading_point_id: null,
          uploading_point_id: null,
          end_customer_id: null,
          customer_user_id: 1,
          truck_type_id: truckType.truck_id,
          weight_type: tons,
          created_by: id_user,
          material_type_id: materialType.truck_id,
          customer_price: parseInt(targetPrice),
          trip_status_id: 1,
          origin_id: 10,
          pkgs: pkgs,
          weight: parseInt(targetWeight),
          pickupDate: pickUpDate.date,
          volumetric_weight: volumatricWeight,
          to_pincode: sourcePin,
          from_pincode: destinationPin,
          from_address_id: fromId,
          to_address_id: toId,
          // remarks:remarks,
          kilometer: totalKm,
          // coordinator_name:personInfo?.coordinate_name,
          // coordinator_mobile:personInfo?.coordinate_number,
          to_area: selectedCity?.destination.split(',')[0],
          to_city: selectedCity?.destination.split(',')[1],
          to_state: selectedCity?.destination.split(',')[2],
          to_country: selectedCity?.destination.split(',')[3],
          from_area: selectedCity?.source.split(',')[0],
          from_city: selectedCity?.source.split(',')[1],
          from_state: selectedCity?.source.split(',')[2],
          from_country: selectedCity?.source.split(',')[3],
          ...(personInfo?.coordinate_name && { coordinator_name: personInfo.coordinate_name }),
          ...(personInfo?.coordinate_number && { coordinator_mobile: personInfo.coordinate_number }),
          ...(remarks && { remarks: remarks }),
        },
        { headers:headers },
      )
      .then((response) => {
        setIsLoading(false);
        console.log('General', response);
        toast('Indent Updated Successfully', { type: 'success' });
        axios
          .get(BACKEND_URL + `/indent/get_indents?created_by=${id_user}`)
          .then((response) => {
            console.log('RESPONSE', response);
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                info.push(response.data[i]);
              }
            }
            navigate('/all-indent/' + id_user);
            window.location.reload();
          })
          .catch((err) => {
            console.log('ERRRRRRRR', err);
          });
      })
      .catch((error) =>  {
        if (error.response && error.response.status === 401) {
            sessionStorage.clear()
            navigate('/login');
          } else {
            console.error('Error:', error);
            toast('Error in Update Indent', { type: 'error' });
          }
    });
    };
      

  const fetchPincodeDetails = (pincode, type) => {
    // try {
    //   axios
    //     .get(`${BACKEND_URL}/pincode/${pincode}`)
    //     .then((resp) => {
    //       if (resp.status === 200) {
    //         const { Area, State, Country } = resp.data;
    //         if (type === 'source') {
    //           setSelectedCity((prev) => ({ ...prev, source: `${Area} ${State} ${Country}` }));
    //         } else if (type === 'destination') {
    //           setSelectedCity((prev) => ({ ...prev, destination: `${Area} ${State} ${Country}` }));
    //         }
    //       } else {
    //         toast(`City/State not found for this pincode: ${pincode}`, { type: 'error' });
    //       }
    //     })
    //     .catch(() => {
    //       toast(`Unable to get location from this pincode: ${pincode}`, { type: 'error' });
    //     });
    // } catch (e) {
    //   console.error(e);
    // }

    try {
      axios
        .get(`${BACKEND_URL}/pincode/${pincode}`,{ headers:headers })
        .then((resp) => {
          if (resp.status === 200) {
            setSuggestions(resp.data);
          } else {
            toast(`City/State not found for this pincode: ${pincode}`, { type: 'error' });
          }
        })
        .catch(() => {
          toast(`Unable to get location from this pincode: ${pincode}`, { type: 'error' });
        });
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        sessionStorage.clear()
        navigate('/login');
    } 
    }

    // let temp_url = `/address/address_suggestion/`

    // try {
    //     axios
    //       .get(BACKEND_URL + `${temp_url}?string=${String(pincode)}&created_by=${sessionStorage.getItem('user_id')}`)
    //       .then((resp) => {
    //         if (resp.status === 200) {
    //           setSuggestions(resp.data)
    //         } else {
    //           toast(`City/State not found for this pincode: ${pincode}`, { type: 'error' });
    //         }
    //       })
    //       .catch(() => {
    //         toast(`Unable to get location from this pincode: ${pincode}`, { type: 'error' });
    //       });
    //   } catch (e) {
    //     console.error(e);
    //   }
  };

  // useEffect(() => {
  //   if (sourcePin.length == 6) {
  //     fetchPincodeDetails(sourcePin, 'source');
  //   }
  //   if (destinationPin.length == 6) {
  //     fetchPincodeDetails(destinationPin, 'destination');
  //   }
  // }, [sourcePin, destinationPin]);

  const handleInputChange = (e, type) => {
    const { value } = e.target;
    if (type === 'source') {
      setSourcePin(value);
    } else if (type === 'destination') {
      setDestinationPin(value);
    }
  };

  const handlePersonInfoChange = (e) => {
    const { id, value } = e.target;
    setPersonInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleContactPersonInfoChange = (e) => {
    const { id, value } = e.target;
    setContactPersonInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePersonMobileNumberChange = (e) => {
    const { id, value } = e.target;
    setPersonInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const togglePopup = () => {
    searchParams.set('open', 'false');
    setSearchParams(searchParams);
    setPopupVisible(!isPopupVisible);
  };

  const fetchSuggestions = async (value) => {
    let temp_url = `/address/address_suggestion/`;
    try {
      axios
        .get(
          BACKEND_URL +
            `${temp_url}?string=${String(value)}&created_by=${sessionStorage.getItem('company_id')}`,{ headers:headers }
        )
        .then((resp) => {
          if (resp.status === 200) {
            setBgColor(true);
            setSuggestions(resp.data);
            if (resp.data.length == 0) {
              setBgColor(false);
              fetchPincodeDetails(value, '');
            }
          } else {
            toast(`City/State not found for this pincode: ${value}`, { type: 'error' });
          }
        })
        .catch(() => {
          toast(`Unable to get location from this pincode: ${value}`, { type: 'error' });
        });
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        sessionStorage.clear()
        navigate('/login');
    } 
    }

    // try {
    //   axios
    //     .get(`${BACKEND_URL}/pincode/${value}`)
    //     .then((resp) => {
    //       if (resp.status === 200) {
    //         setSuggestions(resp.data)
    //       } else {
    //         toast(`City/State not found for this pincode: ${value}`, { type: 'error' });
    //       }
    //     })
    //     .catch(() => {
    //       toast(`Unable to get location from this pincode: ${value}`, { type: 'error' });
    //     });
    // } catch (e) {
    //   console.error(e);
    // }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length == 6) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => sourcePin;
  const getDestSuggestionValue = (suggestion) => destinationPin;

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.area}, {suggestion.city}, {suggestion.state}, {suggestion.country}
    </div>
  );

  const inputProps = {
    placeholder: 'Enter Source Pincode',
    value: sourcePin,
    onChange: (e, { newValue }) => setSourcePin(newValue),
    id: 'sourcePincode',
    className:
      'block min-h-[36px] w-full rounded-md border border-gray-300 px-2.5 text-sm text-gray-900 focus:border-[#3181e8] focus:ring-[#3181e8] disabled:bg-neutral-300',
  };

  const inputDestProps = {
    placeholder: 'Enter Destination Pincode',
    value: destinationPin,
    onChange: (e, { newValue }) => setDestinationPin(newValue),
    id: 'destinationPincode',
    className:
      'block min-h-[36px] w-full rounded-md border border-gray-300 px-2.5 text-sm text-gray-900 focus:border-[#3181e8] focus:ring-[#3181e8] disabled:bg-neutral-300',
  };

  const theme = {
    container: 'relative w-full',
    input: 'w-full p-2 text-lg',
    suggestionsContainer: `absolute z-20 ${
      bgColor ? 'bg-yellow-200' : 'bg-white'
    } max-h-52 overflow-y-auto w-full shadow-md`,
    suggestionsList: 'list-none  m-0 p-0',
    suggestion: 'p-2 cursor-pointer',
    suggestionHighlighted: 'bg-gray-300',
  };

  return (
    <PageWithSidebar>
      {isLoading && <Loader />}
      <Address isVisible={isPopupVisible} onClose={togglePopup} />
      {sessionStorage.getItem('is_company') == 0 && (
        <div className="flex flex-col items-center justify-center gap-4 p-3">
          <div className="flex w-[80%] flex-row justify-between gap-8 rounded p-4 shadow">
            <div className="flex w-1/2 flex-col">
              <label
                htmlFor="sourcePincode"
                className={`mb-2 flex items-center  text-sm font-medium text-gray-600`}>
                From Pincode
              </label>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={(event, { suggestion }) => {
                  const { area, city, state, country, id } = suggestion;
                  setSelectedCity((prev) => ({
                    ...prev,
                    source: `${area + ','}${city + ','}${state + ','}${country}`,
                  }));
                  setFromId(id);
                }}
                theme={theme}
              />
              {/* {!isValidAddress && <p className="mt-1 text-xs text-red-500">Address is required.</p>} */}
            </div>
            <div className="flex w-1/2 flex-col">
              <label
                htmlFor="destinationPincode"
                className={`mb-2 flex items-center  text-sm font-medium text-gray-600`}>
                To Pincode
              </label>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getDestSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputDestProps}
                onSuggestionSelected={(event, { suggestion }) => {
                  const { area, city, state, country, id } = suggestion;
                  setSelectedCity((prev) => ({
                    ...prev,
                    destination: `${area + ','}${city + ','}${state + ','}${country}`,
                  }));
                  setToId(id);
                }}
                theme={theme}
              />
              {/* {!isValidAddress && <p className="mt-1 text-xs text-red-500">Address is required.</p>} */}
            </div>
          </div>

          <div className="flex w-[80%] flex-row justify-between gap-8 rounded p-4 shadow">
            <div className="flex w-1/2 flex-col">
              <p className="flex flex-row items-center justify-between">
                <span className="font-medium">
                  <span className="text-lg text-red-800">*</span> From Area, City, State, Country
                </span>
                {/* <div className=" flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-blue-700 text-[18px] text-white">
                  <span style={{ marginTop: '-2px' }}>+</span>
                </div> */}
              </p>
              <input
                ref={inputRef}
                className="h-10 w-[100%] cursor-not-allowed rounded border-0 bg-gray-100 px-2 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder=""
                type="text"
                value={selectedCity.source}
                disabled
              />
              {/* <Dropdown isOpen={isDropdownOpen.source} type='source' /> */}
            </div>
            <div className="flex w-1/2 flex-col">
              <p className="flex flex-row items-center justify-between">
                <span className="font-medium">
                  <span className="text-lg text-red-800">*</span> To Area, City, State, Country
                </span>
                {/* <div className=" flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-blue-700 text-[18px] text-white">
                  <span style={{ marginTop: '-2px' }}>+</span>
                </div> */}
              </p>
              <input
                ref={inputRef}
                className="h-10 w-[100%] cursor-not-allowed rounded border-0 bg-gray-100 px-2 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder=""
                type="text"
                value={selectedCity.destination}
                disabled
              />
              {/* <Dropdown isOpen={isDropdownOpen.destination} type='destination' /> */}
            </div>
          </div>

          <div className="mb-3 w-[80%] items-center justify-center md:flex">
            <div className="flex w-1/2 justify-center gap-5">
              <div className="text-lg font-medium">{'Type Of Shipment :'}</div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="ftl"
                  value="ftl"
                  name="type"
                  checked={shipmentDetails?.type === 'ftl'}
                  onChange={handleShipment}
                />
                <label htmlFor="ftl" className="text-xs font-medium text-gray-900">
                  FTL
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="ptl"
                  value="ptl"
                  name="type"
                  checked={shipmentDetails?.type === 'ptl'}
                  onChange={handleShipment}
                />
                <label htmlFor="ptl" className="items-center text-xs font-medium text-gray-900">
                  PTL
                </label>
              </div>
            </div>
          </div>

          <div className="flex w-[80%] flex-wrap justify-between gap-4 rounded p-6 shadow">
            <div className="flex w-[49%] flex-row justify-between">
              <Field
                type={'date'}
                id={'date'}
                label={'PickUp Date And Time'}
                inputClassNames={'text-xs'}
                labelClassNames={'text-xs'}
                placeHolder={'Enter PickUp Date'}
                required={true}
                minDate={moment(new Date()).format('YYYY-MM-DD')}
                // maxDate={moment(new Date()).format('YYYY-MM-DD')}
                value={pickUpDate.date}
                onChange={handlePickUpDate}
              />
              <Field
                type={'time'}
                id={'time'}
                inputClassNames={'text-xs mt-6 ml-2'}
                labelClassNames={'text-xs'}
                placeHolder={''}
                required={true}
                value={pickUpDate.time}
                onChange={handlePickUpDate}
              />
            </div>

            {shipmentDetails.type == 'ptl' && (
              <div className="w-[49%]">
                <Field
                  value={pkgs}
                  label="No. of Pkgs"
                  inputClassNames={'text-xs'}
                  labelClassNames={'text-xs'}
                  type="number"
                  onChange={(e) => setPkgs(e.target.value)}
                />
              </div>
            )}

            {shipmentDetails.type == 'ptl' && (
              <div className="w-full md:flex">
                <div className="w-full gap-4 md:flex">
                  <label className="dark:text-white mb-3 mt-1 block text-base font-medium text-gray-600">
                    {'Enter Packages dimensions to calculate Volumetric Weight'}
                  </label>
                  <div className="sm:w-/12 pb-2 md:pb-0">
                    <Field
                      type={'number'}
                      id={'length'}
                      inputClassNames={'text-xs'}
                      placeHolder={'0.00'}
                      required={true}
                      rightAddOn="CM"
                      value={truckDimention?.length || ''}
                      onChange={handleTruckDimention}
                    />
                  </div>
                  <div className="sm:w-/12 pb-2 md:pb-0">
                    <Field
                      type={'number'}
                      id={'width'}
                      inputClassNames={'text-xs'}
                      placeHolder={'0.00'}
                      required={true}
                      rightAddOn="CM"
                      value={truckDimention?.width || ''}
                      onChange={handleTruckDimention}
                    />
                  </div>
                  <div className="sm:w-/12 pb-2 md:pb-0">
                    <Field
                      type={'number'}
                      id={'height'}
                      inputClassNames={'text-xs'}
                      placeHolder={'0.00'}
                      required={true}
                      rightAddOn="CM"
                      value={truckDimention?.height || ''}
                      onChange={handleTruckDimention}
                    />
                  </div>
                </div>
              </div>
            )}

            {shipmentDetails.type == 'ptl' && (
              <div className=" my-5 w-[49%] rounded-md bg-[#ecf2fe99] p-5 text-sm font-medium text-gray-900">
                <div className="mb-1 flex">
                  <p>{'Volumetric Weight'}</p>
                  <p className="ml-9">{volumatricWeight + 'kg.'}</p>
                </div>
              </div>
            )}

            {shipmentDetails.type == 'ftl' && (
              <div className="w-[49%]">
                <CustomMultiSelect
                  isMulti={false}
                  label={'Truck Type'}
                  options={truckTypesData}
                  selected={truckType.value}
                  closeMenuOnSelect={true}
                  placeholder={truckType.value}
                  hideSelectedOptions={false}
                  onChange={(value) => {
                    setTruckType(value);
                  }}
                />
              </div>
            )}
            <div className="w-[49%]">
              {/* <CustomMultiSelect
                            isMulti={false}
                            placeholder={userOptions[0].label}
                            label={'Contact Person'}
                            options={userOptions}
                            closeMenuOnSelect={true}
                            onChange={() => {
                                console.log('User selected');
                            }}
                        /> */}

              <Field
                type="text"
                id="contact_name"
                label="Contact Person"
                inputClassNames="text-xs"
                labelClassNames="text-xs"
                placeHolder="Enter Contact Name"
                required={true}
                value={contactPersonInfo?.contact_name}
                onChange={handleContactPersonInfoChange}
              />
            </div>
            <div className="w-[49%]">
              <CustomMultiSelect
                isMulti={false}
                label={'Material Type'}
                options={materialTypesData}
                selected={materialType.value}
                closeMenuOnSelect={true}
                placeholder={materialType.value}
                hideSelectedOptions={false}
                onChange={(value) => {
                  setMaterialType(value);
                }}
              />
            </div>
            <div className="w-[49%]">
              <div className="flex w-full">
                <div className="flex-grow pr-2">
                  <CustomMultiSelect
                    isMulti={false}
                    label={'Weight'}
                    options={weightTypes}
                    selected={tons}
                    closeMenuOnSelect={true}
                    placeholder={tons}
                    hideSelectedOptions={false}
                    onChange={(value) => {
                      setTons(value);
                    }}
                  />
                </div>
                <div className="mt-6 flex-grow pr-4">
                  <Field
                    value={targetWeight}
                    type="number"
                    placeholder="Enter Weight"
                    onChange={(e) => setTargetWeight(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="w-[49%]">
              <Field
                value={targetPrice}
                label="Target Price"
                type="number"
                placeholder="Enter Target Price"
                onChange={(e) => setTargetPrice(e.target.value)}
                leftAddOn="₹"
              />
            </div>

            <div className="w-[49%]">
              <div className="flex w-full">
                <div className="flex-grow pr-2">
                  <Field
                    type="text"
                    id="remark"
                    label="Remarks"
                    inputClassNames="text-xs"
                    labelClassNames="text-xs"
                    placeHolder="Enter Remark"
                    required={true}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="w-[49%]">
              <Field
                value={totalKm}
                label="Total Km"
                type="number"
                placeholder="Enter Total Kilometer"
                // onChange={(e) => setTotalKm(e.target.value)}
                isDisabled={true}
                inputClassNames="cursor-not-allowed"
                leftAddOn="Km."
              />
            </div>

            <div className="w-[49%]">
              <div className="flex w-full">
                <div className="flex-grow pr-2">
                  <Field
                    type="text"
                    id="coordinate_name"
                    label="Coordinate Name"
                    inputClassNames="text-xs"
                    labelClassNames="text-xs"
                    placeHolder="Enter Name"
                    required={false}
                    value={personInfo?.coordinate_name}
                    // value={`Mann thakkar`}
                    isDisabled={false}
                    onChange={handlePersonInfoChange}
                  />
                </div>
              </div>
            </div>
            <div className="w-[49%]">
              <Field
                id="coordinate_number"
                // value={`8401747809`}
                value={personInfo?.coordinate_number}
                label="Mobile No."
                inputClassNames="text-xs"
                labelClassNames="text-xs"
                type="number"
                placeholder="Enter Mobile Number"
                isDisabled={false}
                onChange={handlePersonMobileNumberChange}
                leftAddOn="+91"
                onBlur={() => {
                  setIsValidPhone(/^\d{10}$/.test(personInfo?.coordinate_number));
                }}
              />
              {!isValidPhone && (
                <p className="mt-1 text-xs text-red-500">Please enter a valid 10-digit number.</p>
              )}
            </div>
            {/* <div className="w-[100%]">
            <Field
              id="address"
              // value={personInfo?.coordinate_number}
              label="Address"
              inputClassNames="text-xs"
              labelClassNames="text-xs"
              type="text"
              placeholder="Enter Address"
              isDisabled={false}
              onChange={handlePersonMobileNumberChange}
            />
          </div> */}
          </div>
          <button
            className="bottom-4 ml-10 rounded-full bg-sky-500 p-2 text-lg font-semibold text-white hover:bg-blue-800 md:w-1/2"
            onClick={() => {
              // let upDateId = id + 1;
              // setId(upDateId);
              if (!modifyFlag) {
                handleSubmit();
              } else {
                handleModify();
              }
            }}>
            {modifyFlag == 0 ? '+ Create Indent' : '+ Modify Indent'}
          </button>
        </div>
      )}
    </PageWithSidebar>
  );
};

export default Indent;
