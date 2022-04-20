import { Box, Checkbox, Heading, VStack } from '@chakra-ui/react'

const PartsOfSpeechMenu = () => {
  return (
    <Box pos="fixed" border="1px solid red">
      <VStack pos="relative" left="16" top="16" align="stretch">
        <Heading size="md">Parts of Speech</Heading>
        <Checkbox colorScheme="red" defaultChecked>
          Nouns
        </Checkbox>
        <Checkbox colorScheme="red">Verbs</Checkbox>
        <Checkbox colorScheme="red">Adjectives</Checkbox>
        <Checkbox colorScheme="red">Adverbs</Checkbox>
        <Checkbox colorScheme="red">Pronouns</Checkbox>
        <Box
          pos="absolute"
          right={0}
          top={0}
          h="300px"
          w="2px"
          bg="red"
          transform="rotate(45deg)"
        ></Box>
      </VStack>
    </Box>
  )
}

export default PartsOfSpeechMenu
