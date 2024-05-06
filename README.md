# react-native-remote-font

Easy way for text component to apply custom remote font.   
Just tell the component the font's name and url.

[![effect](https://zyestin.github.io/art-text/media/17016760060792/font-down-apply-1.gif)](https://zyestin.github.io/art-text/)

## Why?

- No need to worry about font's download, cache, load.  
- No need to worry about complicated logic when switching fonts.

## Getting started

`$ npm install react-native-remote-font --save`

### Mostly automatic installation

`$ react-native link react-native-remote-font`

## Usage
```javascript
import ArtText from "react-native-remote-font";

<ArtText
  text="Hello World"
  style={{ fontSize: 20 }}
  fontInfo={{
    fontName: "Afacad",
    fontUrl: "https://fonts.gstatic.com/s/afacad/v1/6NUI8FKMIQOGaw6ahLYEvBjUVG5Ga92uVSQ-9kKlZfNfuw.ttf",
  }}
/>
```

## Props

Passthrough the properties of all Text components, such as text, style, etc. 

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| fontInfo.fontName | string |  | Font name |
| fontInfo.fontUrl | string |  | Font download web url |


## run example

* android
`$ cd example && yarn && yarn start && yarn android`

* ios
`$ cd example && yarn && yarn start && yarn ios`

If you meet some error like package link, try to find the solution here https://zyestin.github.io/create-npm-lib/#%E8%BF%90%E8%A1%8C-android%E6%8C%BA%E5%9D%91


## License

MIT

## Thanks

* [create-react-native-module](https://github.com/brodybits/create-react-native-module)
