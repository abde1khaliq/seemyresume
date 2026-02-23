import { Box, Image, Button, Flex, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box zIndex={100} px={8} bg="transparent">
      <Flex
        w="100%"
        maxW="1500px"
        mx="auto"
        h="70px"
        align="center"
        justify="space-between"
      >
        {/* LOGO */}
        <Flex align="center" gap={2}>
          <Image
            w="26px"
            h="auto"
            src="https://i.postimg.cc/7YWgCkGp/cropped.png"
          />
          <Text
            fontSize="sm"
            fontWeight="600"
            letterSpacing="-0.01em"
            color="gray.800"
          >
            resumé
          </Text>
        </Flex>

        <Flex gap={8} align="center" display={{ base: "none", md: "flex" }}>
          {["Templates", "Examples", "Pricing"].map((item) => (
            <Text
              key={item}
              fontSize="sm"
              color="gray.500"
              letterSpacing="0.01em"
              cursor="pointer"
              _hover={{ color: "gray.800" }}
              transition="color 0.15s ease"
            >
              {item}
            </Text>
          ))}
        </Flex>

        {/* ACTIONS */}
        <Flex gap={2} align="center">
          <Button
            variant="ghost"
            size="sm"
            color="gray.500"
            fontWeight="500"
            fontSize="sm"
            letterSpacing="0.01em"
            borderRadius="10px"
            _hover={{ bg: "gray.100", color: "gray.800" }}
          >
            Sign In
          </Button>
          <Button
            bg="accent"
            color="white"
            size="sm"
            px={5}
            borderRadius="10px"
            fontSize="sm"
            letterSpacing="0.02em"
            _hover={{ bg: "accentH" }}
          >
            Build Resume
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
