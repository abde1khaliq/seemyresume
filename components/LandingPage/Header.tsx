import { Box, Image, Button, Flex } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex
      w="100%"
      h="70px"
      px={4}
      align="center"
      justify="space-evenly"
      background={"transparent"}
    >
      <Image
        w="30px"
        h={"auto"}
        src="https://i.postimg.cc/7YWgCkGp/cropped.png"
      />
      <Flex gap={3} align="center">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
        <Button bg="accent" color={"white"} size="sm">
          Create Resume
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
