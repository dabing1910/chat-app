import { useState } from 'react';
import {
  Box,
  VStack,
  Avatar,
  Text,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  List,
  ListItem,
  IconButton,
  HStack,
  useToast
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';

const Friends = () => {
  const [friends] = useState([
    { id: 1, name: '张三', avatar: 'https://bit.ly/dan-abramov', status: '在线' },
    { id: 2, name: '李四', avatar: 'https://bit.ly/ryan-florence', status: '离线' },
    { id: 3, name: '王五', avatar: 'https://bit.ly/kent-c-dodds', status: '在线' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const handleAddFriend = (friendId) => {
    toast({
      title: '添加成功',
      description: '已发送好友请求',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={4} align="stretch">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="搜索好友"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Divider />

        <List spacing={3}>
          {filteredFriends.map((friend) => (
            <ListItem key={friend.id}>
              <Box p={3} borderWidth="1px" borderRadius="lg">
                <HStack spacing={4} justify="space-between">
                  <HStack spacing={4}>
                    <Avatar
                      size="md"
                      name={friend.name}
                      src={friend.avatar}
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{friend.name}</Text>
                      <Text fontSize="sm" color={friend.status === '在线' ? 'green.500' : 'gray.500'}>
                        {friend.status}
                      </Text>
                    </VStack>
                  </HStack>
                  <IconButton
                    aria-label="Add friend"
                    icon={<AddIcon />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleAddFriend(friend.id)}
                  />
                </HStack>
              </Box>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Friends;