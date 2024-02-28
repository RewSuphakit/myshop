import React from 'react'

function AddCategory() {
  return (
    <>
    <button className="btn" onClick={()=>document.getElementById('my_modal_4').showModal()}>Add Category</button>
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Add Category!</h3>
        <p className="py-4">เวลาไม่พอ </p>
        <div className="modal-action">
          <form method="dialog">
            <div></div>
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
    </>
  )
}

export default AddCategory
