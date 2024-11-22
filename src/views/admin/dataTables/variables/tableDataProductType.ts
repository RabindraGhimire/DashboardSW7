import soundbox1 from 'assets/img/products/soundbox1.jpg';
import soundbox2 from 'assets/img/products/soundbox2.jpg';
import soundbox3 from 'assets/img/products/soundbox3.jpg';
import soundbox4 from 'assets/img/products/soundbox4.jpg';
import soundbox5 from 'assets/img/products/soundbox5.jpg';

type RowObj = { 
    name: string;
    image?: string; // The image field should be a string (URL or path to the image) and optional
    status: string;
    date: string;
    progress: number;
};



const tableDataProductType: RowObj[] = [
  {
    name: 'Speakers',
    image: soundbox1,
    status: 'Ready to Order',
    progress: 75.5,
    date: '12.Jan.2021',
  },
  {
    name: 'Batteries',
    image: soundbox2,
    status: 'In Repair',
    progress: 35.4,
    date: '21.Feb.2021',
  },
  {
    name: 'Chargers',
    image: soundbox3,
    status: 'Occupied',
    progress: 50.0,
    date: '13.Mar.2021',
  },
  {
    name: 'Mic',
    image: soundbox4,
    status: 'Ready to Order',
    progress: 90.0,
    date: '24.Jan.2021',
  },
  {
    name: 'Bullshit',
    image: soundbox5,
    status: 'In Repair',
    progress: 60.0,
    date: '25.Apr.2021',
  },
      {
        name: 'Myasalee',
        status: 'In Repair',
		date: 'Oct 24, 2022',
        progress: 75.5
    },
    {
        name: 'Tori',
        status: 'In Repair',
		date: '12.Jan.2021',
        progress: 75.5
    },
    {
        name: 'Rautey',
        status: 'Ready to Order',
		date: '21.Feb.2021',
        progress: 35.4
    },
    {
        name: 'Gandu',
        status: 'In Repair',
		date: '13.Mar.2021',
        progress: 25
    },
    {
        name: 'Jpaitei',
        status: 'Occupied',
		date: '24.Jan.2021',
        progress: 100
    },
    {
        name: 'Guitar',
        status: 'In Repair',
		date: 'Oct 24, 2022',
        progress: 75.5
    }
];

export default tableDataProductType;
