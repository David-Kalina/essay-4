import {
  ChakraProvider,
  Container,
  Box,
  extendTheme,
  Heading,
  HStack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from '@chakra-ui/react'
import * as React from 'react'
import winkNLP from 'wink-nlp'
import its from 'wink-nlp/src/its'
import sentiment from 'wink-sentiment'
import model from 'wink-eng-lite-web-model'
import SpanComponent from './components/SpanComponent'
import { initialText } from './text'

const nlp = winkNLP(model)

// const doc = nlp.readDoc(text)

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const App = () => {
  const [loading, setLoading] = React.useState(true)

  const [showModal, setShowModal] = React.useState(false)

  const [text, setText] = React.useState(initialText)

  const [sampleText, setSampleText] = React.useState('')

  const [doc, setDoc] = React.useState(null)

  const [chakraSpans, setChakraSpans] = React.useState([])

  const sentimentData = sentiment(text)

  const returnSentimentEmoji = score => {
    if (score > 0.5) {
      return '😃'
    } else if (score < 0.5) {
      return '😞'
    }
  }

  const onClose = () => {
    setShowModal(false)
  }

  const magnifyRef = React.useRef(null)

  const regex = React.useMemo(
    () => /(<span class="tag tag-(.*?)">(.*?)<\/span>)/g,
    []
  )

  React.useEffect(() => {
    setDoc(nlp.readDoc(text))
  }, [text])

  React.useEffect(() => {
    if (magnifyRef.current) {
      if (magnifyRef.current.getBoundingClientRect()) {
        setLoading(false)
      }
    }
  }, [])

  React.useEffect(() => {
    if (showModal) setText('')
  }, [showModal])

  React.useEffect(() => {
    let seenEntities = new Set()
    if (doc) {
      doc?.tokens().each(token => {
        let entity = token.parentEntity()
        if (entity === undefined) {
          if (token.out(its.type) === 'word') {
            token.markup(
              `<span class="tag tag-${token.out(its.pos)}">`,
              `</span>`
            )
          }
        } else {
          if (!seenEntities.has(entity.index())) {
            entity.markup(
              '<span class="tag ' + entity.out(its.type) + '">',
              '</span>'
            )
          }
          seenEntities.add(entity.index())
        }
      })
    }
    const arrayText = doc?.out(its.markedUpText).trim().split(regex)

    setChakraSpans(
      arrayText?.map((element, idx) => {
        if (element.includes('span')) {
          const classRegex = /tag-(.*?)"/g

          const textBetweenTagsRegex = />([A-z])*</g

          const textBetweenTags = element.match(textBetweenTagsRegex)

          const classArray = [...element.matchAll(classRegex)]

          return (
            <SpanComponent
              magnifyCords={magnifyRef.current?.getBoundingClientRect()}
              text={
                textBetweenTags &&
                textBetweenTags[0].replace('>', ' ').replace('<', ' ')
              }
              className={`tag ${
                classArray[0] ? `tag-${classArray[0][1]}` : ''
              }`}
              tagType={`${classArray[0] ? `${classArray[0][1]}` : ''}`}
            />
          )
        }
        return null
      })
    )
  }, [doc, regex])

  return (
    <ChakraProvider theme={extendTheme({ config })}>
      <Box p="4" px="6" pb="96">
        <HStack>
          <Link onClick={() => setText(initialText)}>Reset</Link>
          <Link onClick={() => setShowModal(true)}>Add Your Own Text</Link>
        </HStack>
        <Heading textAlign="center" mb="10">
          Artifical Intelligence: Friend or Foe?
        </Heading>
        {!loading ? (
          <Container maxW="3xl" fontFamily="Roboto Mono" py="4" pos="relative">
            {chakraSpans}
            <Box fontSize="3xl" textAlign="center" mt="2rem">
              Sentiment Score: {sentimentData.score}{' '}
              {returnSentimentEmoji(sentimentData.score)}
            </Box>
          </Container>
        ) : (
          'Loading...'
        )}
        <Box
          ref={magnifyRef}
          pos="fixed"
          top={14}
          left="50%"
          transform="translateX(-50%)"
          mx="auto"
          h="300px"
          w={['100%', '100%', '60%', '60%']}
        >
          <Box
            bg="black"
            color="white"
            textAlign="center"
            p="2"
            fontWeight="bold"
          >
            NATURAL LANGUAGE PROCESSOR
          </Box>
          <Box border="6px solid black" w="100%" h="100%">
            <Box w="100%" h="100%" bg="blue.200" opacity={0.3} />
          </Box>
        </Box>
      </Box>
      <Modal isOpen={showModal} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Custom Text</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter at least 40 characters for the best accuracy."
              onChange={e => setSampleText(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={() => setText(sampleText)}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  )
}
