# Simple gulp project (npm + bower)

## Installation

`$ npm install `

`$ bower install `

## Command

#### Default gulp task
`$ gulp`
#### Clean generated, build sass ans js
`$ gulp build`
#### Build sass ans js with file watcher
`$ gulp watch`
#### Build sass to css
`$ gulp sass `
#### Build js 
`$ gulp js `
#### Build js loose files
`$ gulp jsloose`
#### Clean generated folder
`$ gulp clean`

## Environment
By default, it's the development mode.
#### Dev (sourcemap)
`$ gulp sass --env development`
#### Prod (min)
`$ gulp sass --env production`

