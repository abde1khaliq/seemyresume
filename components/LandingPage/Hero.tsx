import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
  Image,
} from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box overflow="hidden">
      <Box
        minH="calc(100vh - 70px)"
        bg="linear-gradient(135deg, #f5f6f8 0%, #ffffff 50%, #f3f4f6 100%)"
        display="flex"
        alignItems="center"
        position="relative"
      >
        <Box
          position="absolute"
          inset={0}
          pointerEvents="none"
          css={{
            backgroundImage:
              "radial-gradient(circle, #c8ccd4 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.35,
          }}
        />

        <Box
          position="absolute"
          top="-120px"
          left="-80px"
          w="500px"
          h="500px"
          borderRadius="full"
          pointerEvents="none"
          css={{
            background:
              "radial-gradient(circle, rgba(200,210,255,0.35) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <Box
          position="absolute"
          bottom="-100px"
          right="-60px"
          w="480px"
          h="480px"
          borderRadius="full"
          pointerEvents="none"
          css={{
            background:
              "radial-gradient(circle, rgba(180,200,255,0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <Box
          position="absolute"
          top="60px"
          left="60px"
          w="40px"
          h="2px"
          bg="gray.300"
          borderRadius="full"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="60px"
          left="60px"
          w="2px"
          h="40px"
          bg="gray.300"
          borderRadius="full"
          pointerEvents="none"
        />

        <Box
          position="absolute"
          bottom="60px"
          right="60px"
          w="40px"
          h="2px"
          bg="gray.300"
          borderRadius="full"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="60px"
          right="60px"
          w="2px"
          h="40px"
          bg="gray.300"
          borderRadius="full"
          pointerEvents="none"
        />

        <Flex
          w="100%"
          maxW="1500px"
          mx="auto"
          align="center"
          direction={{ base: "column", lg: "row" }}
          zIndex={1}
          position="relative"
        >
          <Flex
            direction="column"
            align="flex-start"
            flex={1}
            zIndex={3}
            mr={{ base: 0, lg: 10 }}
          >
            <Badge
              bg="transparent"
              color="gray.500"
              px={4}
              py={1.5}
              borderRadius="5px"
              fontSize="xs"
              mb={6}
              border="1px solid"
              borderColor="gray.400"
              letterSpacing="0.12em"
              textTransform="uppercase"
              fontWeight="500"
            >
              No tech skills required
            </Badge>
            <Heading
              fontSize={{ base: "6xl" }}
              lineHeight="1.1"
              letterSpacing="-0.02em"
              color="gray.700"
              mb={5}
              fontFamily="quatt"
              css={{
                WebkitTextStroke: ".01px black",
              }}
            >
              We design the portfolio
              <br />
              <Box as="span" color="black">
                you own the stage.
              </Box>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.500"
              maxW="460px"
              mb={8}
              lineHeight="1.75"
              letterSpacing="0.01em"
            >
              Build a stunning, job-ready portfolios to flex with in minutes —
              no coding skills, no stress. Just you, your designing skills and
              next your 6 figures job.
            </Text>
            <Flex gap={3} mb={6}>
              <Button
                size="lg"
                px={7}
                borderRadius="10px"
                bg="accent"
                color="white"
                _hover={{ bg: "accentH" }}
                letterSpacing="0.02em"
                fontSize="sm"
              >
                Build My Resume
              </Button>
              <Button
                size="lg"
                px={7}
                borderRadius="10px"
                bg="gray.100"
                color="gray.600"
                _hover={{ bg: "gray.200" }}
                letterSpacing="0.02em"
                fontWeight="500"
                fontSize="sm"
              >
                Resume Examples ↗
              </Button>
            </Flex>
          </Flex>
          <Box
            flex={1}
            position="relative"
            display={{ base: "none", lg: "block" }}
          >
            <Image
              src="https://i.postimg.cc/bv7cfLQM/Group-6.png"
              objectFit="cover"
              css={{
                maskImage: "linear-gradient(to top, transparent 0%, black 20%)",
                WebkitMaskImage:
                  "linear-gradient(to top, transparent 0%, black 20%)",
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Hero;
