'use client';

import { useState, useCallback, useRef } from 'react';
import { Box, Button, VStack, HStack, Text, Icon, Badge } from '@chakra-ui/react';
import { FiUpload, FiFile, FiImage, FiX, FiCheck } from 'react-icons/fi';

interface FileUploadProps {
  onFilesSelected: (files: FileData[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  maxSize?: number;
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  mimeType: string;
}

export function FileUpload({
  onFilesSelected,
  accept = '.pdf,.png,.jpg,.jpeg,.webp',
  multiple = true,
  label = 'Drop files here or click to upload',
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    setError(null);
    setUploading(true);
    
    const newFiles: FileData[] = [];
    const fileArray = Array.from(fileList);
    
    for (const file of fileArray) {
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Max size is ${maxSize / 1024 / 1024}MB`);
        continue;
      }
      
      try {
        const base64 = await convertToBase64(file);
        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          size: file.size,
          base64,
          mimeType: file.type,
        });
      } catch (err) {
        setError(`Failed to process ${file.name}`);
      }
    }
    
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    setUploading(false);
    onFilesSelected(updatedFiles);
  }, [files, maxSize, multiple, onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  }, [files, onFilesSelected]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    onFilesSelected([]);
    setError(null);
  }, [onFilesSelected]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <VStack gap={4} align="stretch">
      <Box
        border="2px dashed"
        borderColor={isDragging ? 'blue.400' : 'gray.300'}
        borderRadius="lg"
        p={8}
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        bg={isDragging ? 'blue.50' : 'transparent'}
        _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <Icon as={FiUpload} boxSize={8} color="gray.400" mb={2} />
        <Text color="gray.500">{label}</Text>
        <Text fontSize="sm" color="gray.400" mt={1}>
          PDF, PNG, JPG, WebP up to {maxSize / 1024 / 1024}MB
        </Text>
      </Box>

      {uploading && (
        <Text color="blue.500" fontSize="sm">
          Processing files...
        </Text>
      )}

      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}

      {files.length > 0 && (
        <VStack align="stretch" gap={2}>
          <HStack justify="space-between">
            <Text fontWeight="medium" fontSize="sm">
              Uploaded Files ({files.length})
            </Text>
            <Button size="xs" variant="ghost" colorPalette="red" onClick={clearFiles}>
              Clear All
            </Button>
          </HStack>
          
          {files.map((file) => (
            <HStack
              key={file.id}
              p={2}
              bg="gray.50"
              borderRadius="md"
              justify="space-between"
            >
              <HStack gap={2}>
                <Icon
                  as={file.type === 'image' ? FiImage : FiFile}
                  color={file.type === 'image' ? 'green.500' : 'red.500'}
                />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {file.name}
                  </Text>
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.500">
                      {formatSize(file.size)}
                    </Text>
                    <Badge size="sm" colorPalette={file.type === 'image' ? 'green' : 'purple'}>
                      {file.mimeType}
                    </Badge>
                  </HStack>
                </Box>
              </HStack>
              <HStack gap={2}>
                <Icon as={FiCheck} color="green.500" />
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <Icon as={FiX} />
                </Button>
              </HStack>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
