import {
	Box, Flex, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Button
} from '@chakra-ui/react';
import {
	createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable
} from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { MdCancel, MdCheckCircle, MdOutlineError } from 'react-icons/md';
import * as React from 'react';

type RowObj = {
	name: string;
	status: string;
	date: string;
	progress: number;
};

const columnHelper = createColumnHelper<RowObj>();

export default function ComplexTable(props: { tableData: RowObj[], onProductClick: (product: RowObj) => void }) {
	const { tableData, onProductClick } = props;
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('secondaryGray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const columns = [
		columnHelper.accessor('name', {
			id: 'name',
			header: () => (
				<Text fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					PRODUCT NAME
				</Text>
			),
			cell: (info) => (
				<Flex align='center'>
					<Text color={textColor} fontSize='sm' fontWeight='700' cursor="pointer"
						onClick={() => onProductClick(info.row.original)}>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('status', {
			id: 'status',
			header: () => (
				<Text fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					STATUS
				</Text>
			),
			cell: (info) => (
				<Flex align='center'>
					<Icon
						w='24px'
						h='24px'
						me='5px'
						color={
							info.getValue() === 'Ready to Order' ? 'green.500' :
							info.getValue() === 'In Repair' ? 'red.500' :
							info.getValue() === 'Occupied' ? 'orange.500' : 'gray.500'
						}
						as={
							info.getValue() === 'Ready to Order' ? MdCheckCircle :
							info.getValue() === 'In Repair' ? MdCancel :
							info.getValue() === 'Occupied' ? MdOutlineError : undefined
						}
					/>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		})
	];
	const table = useReactTable({
		data: tableData,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true
	});

	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Products
				</Text>
				<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				{/* <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Products
				</Text> */}
				<Button colorScheme="blue" size="sm" ml="10px" onClick={() => console.log("Add Product clicked")}>
					Add Product
				</Button>
			</Flex>
				<Menu />
			</Flex>
			{/* Add Button next to the Products heading inside the main table area */}
			
			<Box>
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<Th
										key={header.id}
										colSpan={header.colSpan}
										pe='10px'
										borderColor={borderColor}
										cursor='pointer'
										onClick={header.column.getToggleSortingHandler()}>
										<Flex justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
											{flexRender(header.column.columnDef.header, header.getContext())}
											{header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : null}
										</Flex>
									</Th>
								))}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.map((row) => (
							<Tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<Td
										key={cell.id}
										fontSize={{ sm: '14px' }}
										minW={{ sm: '150px', md: '200px', lg: 'auto' }}
										borderColor='transparent'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Td>
								))}
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
		</Card>
	);
}
