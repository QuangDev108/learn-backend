// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");


    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", function() {
            const currentStatus = this.getAttribute("data-status");
            const id = this.getAttribute("data-id");

            let changeStatus = currentStatus === "active" ? "inactive" : "active";

            const action = path + `/${changeStatus}/${id}?_method=PATCH`;
            formChangeStatus.action = action;

            formChangeStatus.submit(); 
        });
    });
}
//End Change Status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
//End Delete Item