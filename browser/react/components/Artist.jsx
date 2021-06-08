import React from "react";
import {Albums} from "./Albums"

export default class SingleArtist extends React.Component{
    constructor(props){
      super(props)
      this.state={
        frag:0
      }
    }
  
    componentDidMount=() => {
      this.props.selectArtist(this.props.artistId);
    }
  
    render(){
      const {artist}= this.props
      const soloArtist= artist[0]
      const albumsArtist= artist[1]
      const songsArtist= artist[2]
      if(artist.length==0 || this.state.frag==1) return null
      this.setState({frag:1})
      return (
            <div>
                <h3>{soloArtist.data.name}</h3>
                <h4>ALBUMS</h4>
                {console.log(albumsArtist.data)}
                {/* <Albums albums={albumsArtist.data} /> */}
                <h4>SONGS</h4>
            </div>
      )
    }
  }


