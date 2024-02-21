import React from 'react'

function EditProfile() {
  return (
    <div>
    <button className="btn" onClick={()=>document.getElementById('my_modal_4').showModal()}>EDIT</button>
<dialog id="my_modal_4" className="modal">
  <div className="modal-box w-11/12 max-w-5xl">
    <h3 className="font-bold text-lg">Edit!</h3>
    <div className="modal-action">
      <form method="dialog">
      
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
    </div>
  )
}

export default EditProfile
