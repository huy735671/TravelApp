import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { sizes, spacing } from '../constants/theme'

const SectionHeader = ({title,onPress, buttonTitle = 'Button'}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Button title={buttonTitle} />
    </View>
  )
}

export default SectionHeader

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginHorizontal:spacing.l,
    marginTop:spacing.l,
    marginBottom:10,
    marginLeft: spacing.l,
    marginRight: spacing.m,
  },
  title:{
    fontSize: sizes.h3,
    fontWeight:'bold',

  },
 
})