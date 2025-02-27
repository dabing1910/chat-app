import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Avatar,
  Container,
  SimpleGrid,
  Image,
  Heading,
  Divider
} from '@chakra-ui/react';
import { useSharedState } from '../context/SharedStateContext';

const Profile = () => {
  const { moments } = useSharedState();
  const [userInfo] = useState({
    name: '用户名',
    avatar: 'https://bit.ly/dan-abramov'
  });

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={6} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
          <VStack spacing={4} align="center">
            <Avatar
              size="2xl"
              name={userInfo.name}
              src={userInfo.avatar}
            />
            <Heading size="md">{userInfo.name}</Heading>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>我的动态</Heading>
          <VStack spacing={4} align="stretch">
            {moments.map((moment) => (
              <Box key={moment.id} p={4} borderWidth="1px" borderRadius="lg">
                {moment.text && <Text mb={4}>{moment.text}</Text>}
                {moment.images && moment.images.length > 0 && (
                  <SimpleGrid columns={3} spacing={2} mb={4}>
                    {moment.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img.url}
                        alt="Moment"
                        borderRadius="md"
                        objectFit="cover"
                        w="100%"
                        h="100px"
                      />
                    ))}
                  </SimpleGrid>
                )}
                <Text fontSize="sm" color="gray.500">
                  {moment.timestamp}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile;