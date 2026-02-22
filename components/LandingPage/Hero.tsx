import { Box, Flex, Heading, Text, Button, Badge } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box overflow="hidden">
      <Box
        minH="calc(100vh - 60px)"
        bg="linear-gradient(135deg, #f5f6f8 0%, #ffffff 50%, #f3f4f6 100%)"
        position="relative"
        display="flex"
        alignItems="center"
        px={{ base: 6, md: 16 }}
        py={20}
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(180,185,200,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,185,200,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      >
        <Flex
          w="100%"
          maxW="1500px"
          mx="auto"
          align="center"
          direction={{ base: "column", lg: "row" }}
          zIndex={1}
          position="relative"
        >
          {/* LEFT */}
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
              py={1}
              borderRadius="5px"
              fontSize="sm"
              mb={4}
              border="1px solid"
              borderColor={"gray.500"}
            >
              No tech skills required
            </Badge>

            <Heading
              fontSize={{ base: "5xl" }}
              lineHeight="1.1"
              color="gray.700"
              mb={4}
              fontFamily={"quatt"}
              css={{
                WebkitTextStroke: ".01px black", // stroke thickness + color
              }}
            >
              Struggling with Portfolios?
              <br />
              <Box as="span" color="black">
                Let us handle the work
              </Box>
            </Heading>

            <Text
              fontSize={{ base: "md", md: "xl" }}
              color="gray.600"
              maxW="480px"
              mb={6}
            >
              Build a stunning, job-ready resume in minutes — no design skills,
              no coding, no stress. Just you and your future.
            </Text>

            <Flex mb={6}>
              <Button
                size="lg"
                px={8}
                borderRadius="15px"
                bg="accent"
                mr={4}
                color="white"
              >
                Build My Resume — Free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                borderRadius="full"
                _hover={{ bg: "gray.100" }}
              >
                See Examples →
              </Button>
            </Flex>
          </Flex>

          {/* RIGHT CARDS */}
          <Box
            flex={1}
            position="relative"
            h="420px"
            display={{ base: "none", lg: "block" }}
          >
            <Box
              position="absolute"
              left="10%"
              top="5%"
              bg="white"
              borderRadius="xl"
              p={4}
              shadow="xl"
              w="220px"
              border="1px solid"
              borderColor="gray.100"
            >
              <Flex align="center" mb={3}>
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="full"
                  bg="blue.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                >
                  <Text fontSize="lg">👤</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Sarah M.
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Product Manager
                  </Text>
                </Box>
              </Flex>
              <Box h="6px" bg="blue.500" borderRadius="full" mb={2} />
              <Box h="4px" bg="gray.200" borderRadius="full" mb={1} w="80%" />
              <Box h="4px" bg="gray.200" borderRadius="full" mb={1} w="60%" />
              <Box h="4px" bg="gray.200" borderRadius="full" w="70%" />
              <Badge mt={3} colorScheme="green" fontSize="xs">
                ✓ ATS Optimized
              </Badge>
            </Box>

            <Box
              position="absolute"
              left="45%"
              top="30%"
              bg="white"
              borderRadius="xl"
              p={4}
              shadow="xl"
              w="220px"
              border="1px solid"
              borderColor="gray.100"
            >
              <Flex align="center" mb={3}>
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="full"
                  bg="blue.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                >
                  <Text fontSize="lg">👤</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    James T.
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Graphic Designer
                  </Text>
                </Box>
              </Flex>
              <Box h="6px" bg="blue.500" borderRadius="full" mb={2} />
              <Box h="4px" bg="gray.200" borderRadius="full" mb={1} w="80%" />
              <Box h="4px" bg="gray.200" borderRadius="full" mb={1} w="60%" />
              <Box h="4px" bg="gray.200" borderRadius="full" w="70%" />
              <Badge mt={3} colorScheme="green" fontSize="xs">
                ✓ ATS Optimized
              </Badge>
            </Box>

            <Box
              position="absolute"
              left="5%"
              top="55%"
              bg="white"
              borderRadius="xl"
              p={4}
              shadow="xl"
              w="220px"
              border="1px solid"
              borderColor="gray.100"
            >
              <Flex align="center" mb={3}>
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="full"
                  bg="blue.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                >
                  <Text fontSize="lg">👤</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Priya K.
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Marketing Lead
                  </Text>
                </Box>
              </Flex>
              <Box h="6px" bg="blue.500" borderRadius="full" mb={2} />
              <Box h="4px" bg="gray.200" borderRadius="full" mb={1} w="80%" />
              <Box h="4px" bg="gray.200" borderRadius="full" mb={1} w="60%" />
              <Box h="4px" bg="gray.200" borderRadius="full" w="70%" />
              <Badge mt={3} colorScheme="green" fontSize="xs">
                ✓ ATS Optimized
              </Badge>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Hero;
