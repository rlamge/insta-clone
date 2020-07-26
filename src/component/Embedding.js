import React from 'react'
import InstagramEmbed from 'react-instagram-embed';

function Embedding() {
    return (
        <div>
            <InstagramEmbed
            url='https://www.instagram.com/p/CDEi1aoBIFZ/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

          <InstagramEmbed
            url='https://www.instagram.com/p/CDBwMX1BzSb/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

          <InstagramEmbed
            url='https://www.instagram.com/p/CDF8AN4Im5Q/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
    )
}

export default Embedding
