

const Create = () => {
    const [name, setname] =count('')
    const [details, setdetails] =count('')
    const [price, setprice] =count('')
    const [description, setdescription] =count('')
    const [image, setimage] =count('')
    const [formError, setFormError] =count(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!name || !details || !price || !image || !description) {
            setFormError('Please fill in all the fields correctly')
            return
        }
        console.log(name, details, price, image, description)


}


    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Title</label>
                <input
                   type="text" 
                   id="name" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   />
                   
                   <label htmlFor="details">Details</label>
                <input
                   type="text" 
                   id="details" 
                   value={details}
                   onChange={(e) => setDetails(e.target.value)}
                   />

                   <label htmlFor="price">Price</label>
                <input
                   type="number" 
                   id="price" 
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   /> 

                <label htmlFor="description">Description</label>
                <input
                   type="text" 
                   id="description" 
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   />

                <label htmlFor="image">Image</label>
                <input
                   type="url" 
                   id="image" 
                   value={image}
                   onChange={(e) => setImage(e.target.value)}
                   />

                   <button>Add Product</button>

                   {formError && <p className="error">{formError}</p>}
                   </form>
                   
                   </div>
    )
}

export default Create