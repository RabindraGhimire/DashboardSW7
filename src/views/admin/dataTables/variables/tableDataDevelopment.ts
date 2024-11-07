type RowObj = {
	name: string;
	tech: string[];
	date: string;
	progress: number;
};

const tableDataComplex: RowObj[] = [
	{
		name: 'SoundBox1',
		tech: [ 'apple', 'android', 'windows' ],
		date: '12.Jan.2021',
		progress: 75.5
	},
	{
		name: 'SoundBox2',
		tech: [ 'apple' ],
		date: '21.Feb.2021',
		progress: 35.4
	},
	{
		name: 'SoundBox3',
		tech: [ 'apple', 'windows' ],
		date: '13.Mar.2021',
		progress: 25
	},
	{
		name: 'SoundBox4',
		tech: [ 'apple', 'android', 'windows' ],
		date: '24.Jan.2021',
		progress: 100
	},
	{
		name: 'SoundBox5',
		tech: [ 'apple', 'windows' ],
		date: 'Oct 24, 2022',
		progress: 75.5
	},
	{
		name: 'SoundBox6',
		tech: [ 'apple', 'android', 'windows' ],
		date: 'Oct 24, 2022',
		progress: 75.5
	},
	{
		name: 'SoundBox7',
		tech: [ 'apple', 'android', 'windows' ],
		date: '12.Jan.2021',
		progress: 75.5
	},
	{
		name: 'SoundBox8',
		tech: [ 'apple' ],
		date: '21.Feb.2021',
		progress: 35.4
	},
	{
		name: 'SoundBox9',
		tech: [ 'apple', 'windows' ],
		date: '13.Mar.2021',
		progress: 25
	},
	{
		name: 'SoundBox10',
		tech: [ 'apple', 'android', 'windows' ],
		date: '24.Jan.2021',
		progress: 100
	},
	{
		name: 'SoundBox11',
		tech: [ 'apple', 'windows' ],
		date: 'Oct 24, 2022',
		progress: 75.5
	}
];
export default tableDataComplex;
