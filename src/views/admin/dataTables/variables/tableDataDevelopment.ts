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



const tableDataDevelopment: RowObj[] = [
  {
    name: 'SoundBox1',
    image: soundbox1,
    status: 'Ready to Order',
    progress: 75.5,
    date: '12.Jan.2021',
  },
  {
    name: 'SoundBox2',
    image: soundbox2,
    status: 'In Repair',
    progress: 35.4,
    date: '21.Feb.2021',
  },
  {
    name: 'SoundBox3',
    image: soundbox3,
    status: 'Occupied',
    progress: 50.0,
    date: '13.Mar.2021',
  },
  {
    name: 'SoundBox4',
    image: soundbox4,
    status: 'Ready to Order',
    progress: 90.0,
    date: '24.Jan.2021',
  },
  {
    name: 'SoundBox5',
    image: soundbox5,
    status: 'In Repair',
    progress: 60.0,
    date: '25.Apr.2021',
  },
      {
        name: 'SoundBox6',
        status: 'In Repair',
		date: 'Oct 24, 2022',
        progress: 75.5
    },
    {
        name: 'SoundBox7',
        status: 'In Repair',
		date: '12.Jan.2021',
        progress: 75.5
    },
    {
        name: 'SoundBox8',
        status: 'Ready to Order',
		date: '21.Feb.2021',
        progress: 35.4
    },
    {
        name: 'SoundBox9',
        status: 'In Repair',
		date: '13.Mar.2021',
        progress: 25
    },
    {
        name: 'SoundBox10',
        status: 'Occupied',
		date: '24.Jan.2021',
        progress: 100
    },
    {
        name: 'SoundBox11',
        status: 'In Repair',
		date: 'Oct 24, 2022',
        progress: 75.5
    }
];

export default tableDataDevelopment;
