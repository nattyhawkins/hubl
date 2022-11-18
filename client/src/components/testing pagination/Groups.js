const Groups = ({ groups }) => {
  return (
    <article>
      <h2>{groups.name}</h2>
      <p>{groups.bio}</p>
    </article>
  )
}

export default Groups