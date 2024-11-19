import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Avatar,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useToast,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';

// Dummy Orders Data
const initialOrders = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  customer: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  type: i % 2 === 0 ? 'Package' : 'Product',
  dispatchMethod: i % 2 === 0 ? 'Delivery' : 'Self Pickup',
  items: [
    { name: `Item ${i + 1}-A`, quantity: 1 },
    { name: `Item ${i + 1}-B`, quantity: 2 },
  ],
  status: i % 3 === 0 ? 'Dispatched' : 'Pending',
  date: new Date().toLocaleDateString(),
  total: `$${(Math.random() * 100 + 20).toFixed(2)}`,
}));

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState('All');
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('Wolt');
  const toast = useToast();

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleDispatchOrder = (orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'Dispatched' } : order
      )
    );
    setIsOrderDetailsOpen(false);
    toast({
      title: 'Order Dispatched',
      description: 'The order has been successfully marked as dispatched.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMakeAvailableForPickup = (orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'Available for Pickup' }
          : order
      )
    );
    setIsOrderDetailsOpen(false);
    toast({
      title: 'Ready for Pickup',
      description: 'The order is now available for pickup from the location.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAssignDelivery = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: `Delivery via ${deliveryMethod}` }
          : order
      )
    );
    setIsDeliveryModalOpen(false);
    toast({
      title: 'Delivery Assigned',
      description: `The order has been assigned to ${deliveryMethod}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredOrders =
    filter === 'All' ? orders : orders.filter((order) => order.status === filter);

  return (
    <Box p="20px" bg="gray.50" minH="100vh" pt={{ base: '80px', md: '100px' }}>
      <Flex justify="space-between" align="center" mb="4">
        <Text fontSize="2xl" fontWeight="bold">
          Orders Management
        </Text>
        <Select
          width="200px"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Available for Pickup">Available for Pickup</option>
        </Select>
      </Flex>

      {/* Orders Table */}
      <Box bg="white" p="20px" borderRadius="8px" shadow="md">
        <SimpleGrid columns={12} spacing="20px" mb="4">
          <Text fontWeight="bold" gridColumn="span 2">
            Customer
          </Text>
          <Text fontWeight="bold" gridColumn="span 2">
            Type
          </Text>
          <Text fontWeight="bold" gridColumn="span 2">
            Dispatch
          </Text>
          <Text fontWeight="bold" gridColumn="span 2">
            Date
          </Text>
          <Text fontWeight="bold" gridColumn="span 2">
            Status
          </Text>
          <Text fontWeight="bold" gridColumn="span 2">
            Actions
          </Text>
        </SimpleGrid>
        {filteredOrders.map((order) => (
          <SimpleGrid
            columns={12}
            spacing="20px"
            alignItems="center"
            mb="4"
            key={order.id}
            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
          >
            <HStack gridColumn="span 2">
              <Avatar name={order.customer} size="sm" />
              <Text>{order.customer}</Text>
            </HStack>
            <Text gridColumn="span 2">{order.type}</Text>
            <Text gridColumn="span 2">{order.dispatchMethod}</Text>
            <Text gridColumn="span 2">{order.date}</Text>
            <Badge
              gridColumn="span 2"
              colorScheme={
                order.status === 'Pending'
                  ? 'gray'
                  : order.status.includes('Delivery')
                  ? 'blue'
                  : order.status === 'Available for Pickup'
                  ? 'orange'
                  : 'green'
              }
            >
              {order.status}
            </Badge>
            <HStack gridColumn="span 2" spacing="2">
              <Button
                size="sm"
                onClick={() => handleViewOrder(order)}
                variant="outline"
              >
                View
              </Button>
            </HStack>
          </SimpleGrid>
        ))}
      </Box>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isOrderDetailsOpen}
          onClose={() => setIsOrderDetailsOpen(false)}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="lg" fontWeight="bold" mb="2">
                Customer Information
              </Text>
              <Text>Name: {selectedOrder.customer}</Text>
              <Text>Email: {selectedOrder.email}</Text>
              <Text fontSize="lg" fontWeight="bold" mt="4" mb="2">
                Items Ordered
              </Text>
              <VStack align="start" spacing="2">
                {selectedOrder.items.map((item: any, index: number) => (
                  <Text key={index}>
                    {item.name} (Quantity: {item.quantity})
                  </Text>
                ))}
              </VStack>
              <Text fontSize="lg" fontWeight="bold" mt="4">
                Total: {selectedOrder.total}
              </Text>

              {selectedOrder.dispatchMethod === 'Self Pickup' &&
                selectedOrder.status === 'Pending' && (
                  <Button
                    mt="4"
                    size="sm"
                    onClick={() => handleMakeAvailableForPickup(selectedOrder.id)}
                  >
                    Make Available for Pickup
                  </Button>
                )}

              {selectedOrder.dispatchMethod === 'Delivery' &&
                selectedOrder.status === 'Pending' && (
                  <Button
                    mt="4"
                    size="sm"
                    onClick={() => setIsDeliveryModalOpen(true)}
                  >
                    Assign Delivery
                  </Button>
                )}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => setIsOrderDetailsOpen(false)}
                size="sm"
                variant="outline"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delivery Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isDeliveryModalOpen}
          onClose={() => setIsDeliveryModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Assign Delivery</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold" mb="4">
                Select Delivery Platform or Team
              </Text>
              <RadioGroup
                onChange={(value) => setDeliveryMethod(value)}
                value={deliveryMethod}
              >
                <Stack spacing="4">
                  <Radio value="Wolt">Wolt</Radio>
                  <Radio value="In-House Team">In-House Delivery Team</Radio>
                </Stack>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={handleAssignDelivery}
                size="sm"
                variant="outline"
              >
                Assign
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
