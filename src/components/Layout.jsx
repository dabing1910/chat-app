import { Box, Flex, Tab, TabList, Tabs, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Chat from './Chat';
import Moments from './Moments';
import Profile from './Profile';
import Friends from './Friends';

const Layout = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');

  const renderContent = () => {
    switch (tabIndex) {
      case 0:
        return <Chat />;
      case 1:
        return <Friends />;
      case 2:
        return <Moments />;
      case 3:
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <Flex
      direction="column"
      h="100vh"
      w="100%"
      maxW="100%"
      mx="auto"
      bg={bgColor}
      overflow="auto"
      position="relative"
    >
      <Box flex="1" overflow="auto">
        {renderContent()}
      </Box>

      <Box
        position="sticky"
        bottom={0}
        width="100%"
        bg={bgColor}
        borderTop="1px"
        borderColor="gray.200"
        boxShadow="0 -1px 4px rgba(0, 0, 0, 0.1)"
        zIndex={1}
      >
        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          variant="soft-rounded"
          colorScheme="blue"
          isFitted
          size="sm"
        >
          <TabList py={2} px={4}>
            <Tab fontSize="sm" fontWeight="medium">聊天</Tab>
            <Tab fontSize="sm" fontWeight="medium">好友</Tab>
            <Tab fontSize="sm" fontWeight="medium">朋友圈</Tab>
            <Tab fontSize="sm" fontWeight="medium">我的</Tab>
          </TabList>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Layout;