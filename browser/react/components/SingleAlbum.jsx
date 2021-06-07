import React from 'react';
import Songs from './Songs';

export default class SigleAlbum extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount=() => {
    this.props.selectAlbum(this.props.albumId);
  }

  render(){
    const {album, start, selectedSong, albumId}= this.props
    return (
    <div className="album">
      <div>
        <h3>{album.name}</h3>
        <img src={`/api/albums/${albumId}/image`} className="img-thumbnail" />
      </div>
      <Songs 
        songs={album.songs}
        start={start}
        selectedSong={selectedSong}
      />
  </div>)
  }
}