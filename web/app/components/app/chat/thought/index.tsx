'use client'
import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import type { ThoughtItem } from '../type'
import s from './style.module.css'
import { DataSet, Search, ThoughtList, WebReader } from '@/app/components/base/icons/src/public/thought'
import { ChevronDown } from '@/app/components/base/icons/src/vender/line/arrows'

// https://www.freecodecamp.org/news/how-to-write-a-regular-expression-for-a-url/
const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/gi
export type IThoughtProps = {
  list: ThoughtItem[]
}

const getIcon = (toolId: string) => {
  switch (toolId) {
    case 'dataset':
      return <DataSet />
    case 'web_reader':
      return <WebReader />
    default:
      return <Search />
  }
}

const Thought: FC<IThoughtProps> = ({
  list,
}) => {
  const { t } = useTranslation()
  const [isShowDetail, setIsShowDetail] = React.useState(false)
  const getThoughtText = (item: ThoughtItem) => {
    try {
      const input = JSON.parse(item.tool_input)
      switch (item.tool) {
        case 'dataset':
        //   debugger
          return t('explore.universalChat.thought.res.dataset', { input: input.dataset_id })
        case 'web_reader':
          return t(`explore.universalChat.thought.res.webReader.${!input.cursor ? 'normal' : 'hasPageInfo'}`).replace('{url}', `<a href="${input.url}" class="text-[#155EEF]">${input.url}</a>`)
        default: // google, wikipedia
          return t('explore.universalChat.thought.res.search', { query: input.query })
      }
    }
    catch (error) {
      console.error(error)
      return item
    }
  }
  const renderItem = (item: ThoughtItem) => (
    <div className='flex space-x-1 py-[3px] leading-[18px]' key={item.id}>
      <div className='flex items-center h-[18px] shrink-0'>{getIcon(item.tool)}</div>
      <div dangerouslySetInnerHTML={{
        __html: getThoughtText(item),
        // item.thought.replace(urlRegex, (url) => {
        //   return `<a href="${url}" class="text-[#155EEF]">${url}</a>`
        // }),
      }}></div>
    </div>
  )
  return (
    <div className={cn(s.wrap, !isShowDetail && s.wrapHoverEffect, 'inline-block mb-2 px-2 py-0.5 rounded-md text-xs text-gray-500 font-medium')} >
      <div className='flex items-center h-6 space-x-1 cursor-pointer' onClick={() => setIsShowDetail(!isShowDetail)} >
        <ThoughtList />
        <div>{t(`explore.universalChat.thought.${isShowDetail ? 'hide' : 'show'}`)}{t('explore.universalChat.thought.processOfThought')}</div>
        <ChevronDown className={isShowDetail ? 'rotate-180' : '' } />
      </div>
      {isShowDetail && (
        <div>
          {list.map(item => renderItem(item))}
        </div>
      )}
    </div>
  )
}
export default React.memo(Thought)
