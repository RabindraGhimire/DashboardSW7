type RowObj = {
	name: string;
	status: string;
	date: string;
	progress: number;
};

const tableDataPackages: RowObj[] = [
	{
		name: 'Package1',
		status: 'Ready to Order',
		date: '12.Jan.2021',
		progress: 75.5
	},
	{
		name: 'Package2',
		status: 'In Repair',
		date: '21.Feb.2021',
		progress: 35.4
	},
	{
		name: 'Package3',
		status: 'Ready to Order',
		date: '13.Mar.2021',
		progress: 25
	},
	{
		name: 'Package4',
		status: 'Occupied',
		date: '24.Jan.2021',
		progress: 100
	},
	{
		name: 'Package5',
		status: 'Occupied',
		date: 'Oct 24, 2022',
		progress: 75.5
	},
	{
		name: 'Package6',
		status: 'In Repair',
		date: 'Oct 24, 2022',
		progress: 75.5
	},
	{
		name: 'Package7',
		status: 'In Repair',
		date: '12.Jan.2021',
		progress: 75.5
	},
	{
		name: 'Package8',
		status: 'Ready to Order',
		date: '21.Feb.2021',
		progress: 35.4
	},
	{
		name: 'Package9',
		status: 'In Repair',
		date: '13.Mar.2021',
		progress: 25
	},
	{
		name: 'Package10',
		status: 'Occupied',
		date: '24.Jan.2021',
		progress: 100
	},
	{
		name: 'Package11',
		status: 'In Repair',
		date: 'Oct 24, 2022',
		progress: 75.5
	}
];
export default tableDataPackages;
