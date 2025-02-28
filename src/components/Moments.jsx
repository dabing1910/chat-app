import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  Button,
  Text,
  useToast,
  Image,
  SimpleGrid,
  IconButton,
  Textarea,
  Container
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useSharedState } from '../context/SharedStateContext';

const Moments = () => {
  const { moments, addMoment } = useSharedState();
  const [newMomentText, setNewMomentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setSelectedImages(selectedImages.filter(img => img.id !== id));
  };

  const handlePublishMoment = () => {
    if (!newMomentText.trim() && selectedImages.length === 0) {
      toast({
        title: '请输入文字或选择图片',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const moment = {
      id: Date.now(),
      text: newMomentText,
      images: selectedImages,
      timestamp: new Date().toLocaleString(),
    };

    addMoment(moment);
    setNewMomentText('');
    setSelectedImages([]);
  };

  return (
    <Container maxW="container.md" py={4}>
      <Box mb={6} p={4} borderWidth="1px" borderRadius="lg">
        <Textarea
          id="momentText"
          name="momentText"
          value={newMomentText}
          onChange={(e) => setNewMomentText(e.target.value)}
          placeholder="分享新鲜事..."
          mb={4}
        />
        {selectedImages.length > 0 && (
          <SimpleGrid columns={3} spacing={2} mb={4}>
            {selectedImages.map((img) => (
              <Box key={img.id} position="relative">
                <Image
                  src={img.url}
                  alt="Selected"
                  borderRadius="md"
                  objectFit="cover"
                  w="100%"
                  h="100px"
                />
                <IconButton
                  icon={<CloseIcon />}
                  size="xs"
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={() => handleRemoveImage(img.id)}
                  colorScheme="red"
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
        <Box display="flex" justifyContent="space-between">
          <Button
            leftIcon={<AddIcon />}
            onClick={() => fileInputRef.current.click()}
            size="sm"
          >
            添加图片
          </Button>
          <input
            id="imageUpload"
            name="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Button colorScheme="blue" size="sm" onClick={handlePublishMoment}>
            发布
          </Button>
        </Box>
      </Box>

      <VStack spacing={4} align="stretch">
        {moments.map((moment) => (
          <Box key={moment.id} p={4} borderWidth="1px" borderRadius="lg">
            {moment.text && <Text mb={4}>{moment.text}</Text>}
            {moment.images.length > 0 && (
              <SimpleGrid columns={3} spacing={2} mb={4}>
                {moment.images.map((img) => (
                  <Image
                    key={img.id}
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
    </Container>
  );
};

export default Moments;