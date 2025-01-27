import {
    Box, Flex, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, FormControl, FormLabel, Tooltip, Image
} from '@chakra-ui/react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import * as React from 'react';
import { MdCancel, MdCheckCircle, MdOutlineError, MdOutlineArrowBack, MdOutlineArrowForward } from 'react-icons/md';

// Define the RowObj type
type RowObj = {
    name: string;
    image?: string; // Optional image field
    status: string;
    date: string;
    progress: number;
    short_description?: string; // Optional short description
    image_url?: string; // Optional image URL
};

// Define the DevelopmentTableProps interface
interface DevelopmentTableProps {
    tableData: RowObj[];
    onProductClick: (product: RowObj) => void;
}

// Create a column helper
const columnHelper = createColumnHelper<RowObj>();

// Define the DevelopmentTable component
export default function DevelopmentTable(props: DevelopmentTableProps) {
    const { tableData, onProductClick } = props;
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [newProduct, setNewProduct] = React.useState<RowObj>({
        name: '',
        status: '',
        date: '',
        progress: 0,
        short_description: '',
        image_url: '',
    });

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const iconColor = useColorModeValue('secondaryGray.500', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

    // Handle input changes in the modal form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'progress') {
            const progressValue = Number(value);
            if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
                alert('Progress must be a number between 0 and 100.');
                return;
            }
        }
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Handle adding a new product
    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.status) {
            alert('Please fill in all required fields.');
            return;
        }
        tableData.push({ ...newProduct, progress: Number(newProduct.progress) });
        setIsModalOpen(false);
        setNewProduct({
            name: '',
            status: '',
            date: '',
            progress: 0,
            short_description: '',
            image_url: '',
        });
    };

    // Handle closing the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewProduct({
            name: '',
            status: '',
            date: '',
            progress: 0,
            short_description: '',
            image_url: '',
        });
    };

    // Define the table columns
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
                    {info.row.original.image_url && (
                        <Image
                            src={info.row.original.image_url}
                            alt={info.row.original.name}
                            boxSize="40px"
                            borderRadius="md"
                            mr="10px"
                        />
                    )}
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
        columnHelper.accessor('short_description', {
            id: 'description',
            header: () => (
                <Text fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
                    DESCRIPTION
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm'>
                    {info.getValue() || 'No description available.'}
                </Text>
            ),
        }),
        columnHelper.accessor('progress', {
            id: 'progress',
            header: () => (
                <Text fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
                    PROGRESS
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {info.getValue()}%
                </Text>
            ),
        }),
    ];

    // Initialize the table
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
        debugTable: true,
    });

    return (
        <Box w='100%' p={4}>
            <Flex justify="space-between" align="center" mb="20px">
                <Text fontSize="2xl" fontWeight="bold">
                    Products
                </Text>
                <Flex align="center">
                    <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => setIsModalOpen(true)}
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
                        <Tr
                            key={row.id}
                            _hover={{ bg: hoverBgColor }}
                            cursor="pointer"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <Td
                                    key={cell.id}
                                    fontSize={{ sm: '14px' }}
                                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                                    borderColor='transparent'
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Pagination Controls */}
            <Flex justify="center" align="center" px="25px" py="20px">
                <Tooltip label="Previous Page">
                    <Button
                        size="sm"
                        onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                        isDisabled={!table.getCanPreviousPage()}
                        variant="ghost"
                    >
                        <Icon as={MdOutlineArrowBack} w={6} h={6} color="gray.500" />
                    </Button>
                </Tooltip>
                <Text mx="15px">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </Text>
                <Tooltip label="Next Page">
                    <Button
                        size="sm"
                        onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                        isDisabled={!table.getCanNextPage()}
                        variant="ghost"
                    >
                        <Icon as={MdOutlineArrowForward} w={6} h={6} color="gray.500" />
                    </Button>
                </Tooltip>
            </Flex>

            {/* Modal for Adding Product */}
            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
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
                        <FormControl mb="4">
                            <FormLabel>Description</FormLabel>
                            <Input
                                name="short_description"
                                value={newProduct.short_description}
                                onChange={handleInputChange}
                                placeholder="Enter short description"
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Image URL</FormLabel>
                            <Input
                                name="image_url"
                                value={newProduct.image_url}
                                onChange={handleInputChange}
                                placeholder="Enter image URL"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
                            Add
                        </Button>
                        <Button variant="ghost" onClick={handleModalClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
