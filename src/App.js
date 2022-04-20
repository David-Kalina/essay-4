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
import PartsOfSpeechMenu from './components/PartsOfSpeechMenu'
import winkNLP from 'wink-nlp'
import its from 'wink-nlp/src/its'
import as from 'wink-nlp/src/as'
import model from 'wink-eng-lite-web-model'
import SpanComponent from './components/SpanComponent'

const nlp = winkNLP(model)

const initialText = `Our world is as much digital as physical, an internet-powered, real-time globe that keeps everyone only an instant away. Five hundred million tweets and over 4.2 million blogs get published daily, and each year around 4.8 zettabytes of IP traffic is used. Technology is ever-changing and ever-growing. Every year the number of transistors roughly doubles. New algorithms take advantage of the explosion in computing power to accelerate one of the fastest-growing technological trends. Machine Learning. However, as exciting as Machine Learning is as a technology, it's now without risks. Will Machine Learning be the most significant innovation in human history, or will it be one of the most catastrophic?

What is Machine Learning? According to IBM, machine learning is "a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy. (Machine Learning)" For the longest time, AI has been "narrow," meaning that it performs a specific task better than humans outside of that task and serves no other purpose. For example, a narrow AI for chess, image processing, email spam filters, and even self-driving cars fall into this category. Narrow AI has exploded in the last few years and become exponentially more efficient. For humans, narrow AI is great since it allows for the automation of tedious tasks. However, some fear that AI is becoming less limited and more versatile. Some even go as far as to say that AI will become super intelligent and dwarf humans' collective intelligence and represent the majority of Earth's intelligent life in the future.
`
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
      })
    )
  }, [doc, regex])

  return (
    <ChakraProvider theme={extendTheme({ config })}>
      <Box p="4" px="6">
        <HStack>
          <Link onClick={() => setText(initialText)}>Home</Link>
          <Link onClick={() => setShowModal(true)}>Add Your Own Text</Link>
        </HStack>
        <Heading textAlign="center" mb="10">
          Artifical Intelligence: Friend or Foe?
        </Heading>
        {!loading ? (
          <Container maxW="3xl" fontFamily="Roboto Mono" py="4" pos="relative">
            {chakraSpans}
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
          w="55%"
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
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea onChange={e => setSampleText(e.target.value)} />
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
