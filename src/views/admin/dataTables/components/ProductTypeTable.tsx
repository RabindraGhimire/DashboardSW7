import { 
	Box, Flex, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, FormControl, FormLabel 
  } from '@chakra-ui/react';
  import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
  import * as React from 'react';
  import { MdCancel, MdCheckCircle, MdOutlineError, MdOutlineArrowBack, MdOutlineArrowForward } from 'react-icons/md';
  
  type RowObj = {
	name: string;
	status: string;
	date: string;
	progress: number;
  };
  
  const columnHelper = createColumnHelper<RowObj>();
  
  export default function ProductTypeTable(props: { tableData: RowObj[], onProductClick: (product: RowObj) => void }) {
	const { onProductClick } = props;
	const [tableData, setTableData] = React.useState<RowObj[]>(props.tableData);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [isModalOpen, setIsModalOpen] = React.useState(false); // State for modal visibility
	const [newProduct, setNewProduct] = React.useState<RowObj>({ name: '', status: '', date: '', progress: 0 }); // State for new product form
  
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('secondaryGray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	  const { name, value } = e.target;
	  setNewProduct((prev) => ({ ...prev, [name]: value }));
	};
  
	const handleAddProduct = () => {
	  setTableData((prev) => [...prev, { ...newProduct, progress: Number(newProduct.progress) }]);
	  setIsModalOpen(false); // Close the modal after adding the product
	  setNewProduct({ name: '', status: '', date: '', progress: 0 }); // Reset the form
	};
  
	const columns = [
	  columnHelper.accessor('name', {
		id: 'name',
		header: () => (
		  <Text fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
			PRODUCT TYPE
		  </Text>
		),
		cell: (info) => (
		  <Flex align='center'>
			<Text
			  color={textColor}
			  fontSize='sm'
			  fontWeight='700'
			  cursor="pointer"
			  onClick={() => onProductClick(info.row.original)}>
			  {info.getValue()}
			</Text>
		  </Flex>
		),
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
			  color={info.getValue() === 'Ready to Order' ? 'green.500' :
				info.getValue() === 'In Repair' ? 'red.500' :
				info.getValue() === 'Occupied' ? 'orange.500' : 'gray.500'}
			  as={info.getValue() === 'Ready to Order' ? MdCheckCircle :
				info.getValue() === 'In Repair' ? MdCancel :
				info.getValue() === 'Occupied' ? MdOutlineError : undefined}
			/>
			<Text color={textColor} fontSize='sm' fontWeight='700'>
			  {info.getValue()}
			</Text>
		  </Flex>
		),
	  }),
	];
  
	const table = useReactTable({
	  data: tableData,
	  columns,
	  state: { sorting },
	  onSortingChange: setSorting,
	  getCoreRowModel: getCoreRowModel(),
	  getSortedRowModel: getSortedRowModel(),
	  getPaginationRowModel: getPaginationRowModel(),
	  initialState: {
		pagination: {
		  pageSize: 5,
		  pageIndex: 0,
		},
	  },
	  debugTable: true
	});
  
	return (
	  <Box w='100%' p={4}>
		<Flex justify="space-between" align="center" mb="20px">
		  <Text fontSize="2xl" fontWeight="bold">
			Products Type
		  </Text>
		  <Flex align="center">
			<Button
			  size="sm"
			  colorScheme="blue"
			  onClick={() => setIsModalOpen(true)} // Open modal on button click
			  mr="10px"
			>
			  Add Product
			</Button>
		  </Flex>
		</Flex>
  
		<Table variant='simple' color='gray.500' mb='24px'>
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
					onClick={header.column.getToggleSortingHandler()} >
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
  
		{/* Pagination Controls */}
		<Flex justify="center" align="center" px="25px" py="20px">
		  <Button
			size="sm"
			onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
			isDisabled={!table.getCanPreviousPage()}
			variant="ghost"
		  >
			<Icon as={MdOutlineArrowBack} w={6} h={6} color="gray.500" />
		  </Button>
		  <Text mx="15px">
			Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
		  </Text>
		  <Button
			size="sm"
			onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
			isDisabled={!table.getCanNextPage()}
			variant="ghost"
		  >
			<Icon as={MdOutlineArrowForward} w={6} h={6} color="gray.500" />
		  </Button>
		</Flex>
  
		{/* Modal for Adding Product */}
		<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
		  <ModalOverlay />
		  <ModalContent>
			<ModalHeader>Add Product</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
			  <FormControl mb="4">
				<FormLabel>Product Name</FormLabel>
				<Input
				  name="name"
				  value={newProduct.name}
				  onChange={handleInputChange}
				  placeholder="Enter product name"
				/>
			  </FormControl>
			  <FormControl mb="4">
				<FormLabel>Status</FormLabel>
				<Input
				  name="status"
				  value={newProduct.status}
				  onChange={handleInputChange}
				  placeholder="Enter status"
				/>
			  </FormControl>
			  <FormControl mb="4">
				<FormLabel>Date</FormLabel>
				<Input
				  name="date"
				  type="date"
				  value={newProduct.date}
				  onChange={handleInputChange}
				/>
			  </FormControl>
			  <FormControl mb="4">
				<FormLabel>Progress</FormLabel>
				<Input
				  name="progress"
				  type="number"
				  value={newProduct.progress}
				  onChange={handleInputChange}
				  placeholder="Enter progress (e.g., 50)"
				/>
			  </FormControl>
			</ModalBody>
			<ModalFooter>
			  <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
				Add
			  </Button>
			  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
			</ModalFooter>
		  </ModalContent>
		</Modal>
	  </Box>
	);
  }
  