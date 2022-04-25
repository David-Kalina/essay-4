import { Badge, Fade, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  className: string
  text: string
  magnifyCords: any
  tagType: string
}

const SpanComponent = ({ className, text, magnifyCords, tagType }: Props) => {
  const ref = useRef<HTMLElement>()

  const [cName, setCName] = useState('default')

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const span = ref.current
      if (magnifyCords && span) {
        const spanCords = span.getBoundingClientRect()
        // check overlap
        if (
          magnifyCords.left < spanCords.right &&
          magnifyCords.right > spanCords.left &&
          magnifyCords.top < spanCords.bottom - spanCords.height - 20 &&
          magnifyCords.bottom > spanCords.top
        ) {
          setCName(`default ${className}`)
        } else {
          setCName('default')
        }
      }
    })

    return () => {
      window.removeEventListener('scroll', () => {})
    }
  }, [className, magnifyCords])

  useEffect(() => {
    const span = ref.current
    if (magnifyCords && span) {
      const spanCords = span.getBoundingClientRect()
      // check overlap
      if (
        magnifyCords.left < spanCords.right &&
        magnifyCords.right > spanCords.left &&
        magnifyCords.top < spanCords.bottom - spanCords.height - 20 &&
        magnifyCords.bottom > spanCords.top
      ) {
        setCName(`default ${className}`)
      } else {
        setCName('default')
      }
    }
  }, [className, magnifyCords])

  return (
    <Text
      pos="relative"
      ref={ref as any}
      fontSize="2xl"
      m="1.5"
      className="default"
    >
      <Fade in={cName.includes('tag')}>
        <Badge
          color="white"
          hidden={!cName.includes('tag')}
          fontSize="0.6rem"
          pos="absolute"
          top={-3}
          left={0}
          className={cName}
        >
          {tagType}
        </Badge>
      </Fade>
      {text}
    </Text>
  )
}

export default SpanComponent
