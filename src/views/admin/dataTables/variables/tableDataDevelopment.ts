import soundbox1 from 'assets/img/products/soundbox1.jpg';
import soundbox2 from 'assets/img/products/soundbox2.jpg';
import soundbox3 from 'assets/img/products/soundbox3.jpg';
import soundbox4 from 'assets/img/products/soundbox4.jpg';
import soundbox5 from 'assets/img/products/soundbox5.jpg';

type RowObj = { 
    name: string;
    image?: string; // Optional image field
    status: string;
    date: string;
    progress: number;
    short_description?: string; // Optional short description
    image_url?: string; // Optional image URL
};

const tableDataDevelopment: RowObj[] = [
    {
        name: 'SoundBox1',
        image: soundbox1,
        status: 'Ready to Order',
        progress: 75.5,
        date: '12.Jan.2021',
        short_description: 'High-quality soundbox for professional use.',
        image_url: soundbox1,
    },
    {
        name: 'SoundBox2',
        image: soundbox2,
        status: 'In Repair',
        progress: 35.4,
        date: '21.Feb.2021',
        short_description: 'Portable soundbox for outdoor events.',
        image_url: soundbox2,
    },
    {
        name: 'SoundBox3',
        image: soundbox3,
        status: 'Occupied',
        progress: 50.0,
        date: '13.Mar.2021',
        short_description: 'Compact soundbox for small venues.',
        image_url: soundbox3,
    },
    {
        name: 'SoundBox4',
        image: soundbox4,
        status: 'Ready to Order',
        progress: 90.0,
        date: '24.Jan.2021',
        short_description: 'High-power soundbox for large events.',
        image_url: soundbox4,
    },
    {
        name: 'SoundBox5',
        image: soundbox5,
        status: 'In Repair',
        progress: 60.0,
        date: '25.Apr.2021',
        short_description: 'Durable soundbox for rugged environments.',
        image_url: soundbox5,
    },
    {
        name: 'SoundBox6',
        status: 'In Repair',
        date: 'Oct 24, 2022',
        progress: 75.5,
        short_description: 'No description available.',
    },
    // Add more products...
];

export default tableDataDevelopment;