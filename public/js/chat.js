import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@2/dist/esm/index.js";

// FileUploadWithPreview
const upload = new FileUploadWithPreview.FileUploadWithPreview(
    "upload-image",
    {
        multiple: true,
        maxFileCount: 6
    }
);
// End FileUploadWithPreview

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
    formSendData.addEventListener("submit", async (e) => {
        e.preventDefault();

        const content = e.target.elements.content.value;
        const userId = document.querySelector("[my-id]").getAttribute("my-id");
        const fullName = document.querySelector("[my-fullname]")?.getAttribute("my-fullname") || "Người dùng";
        const images = [];

        // Convert files sang base64 string (sử dụng Promise)
        const convertFilesToBase64 = async () => {
            const promises = upload.cachedFileArray.map(file => {
                return new Promise((resolve, reject) => {
                    try {
                        const reader = new FileReader();
                        
                        reader.onload = function(event) {
                            resolve(event.target.result); // base64 string
                        };
                        
                        reader.onerror = function() {
                            reject(new Error("Lỗi đọc file"));
                        };
                        
                        reader.readAsDataURL(file);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            
            return Promise.all(promises);
        };

        try {
            // Chờ tất cả files được convert xong
            const convertedImages = await convertFilesToBase64();
            images.push(...convertedImages);

            socket.emit("CLIENT_SEND_MESSAGE", {
                content,
                images,
                userId,
                fullName,
                room_chat_id: "general"
            });

            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
        } catch (error) {
            console.error("Lỗi khi convert file:", error);
        }
    });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document
        .querySelector("[my-id]")
        .getAttribute("my-id");

    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    const boxTyping = document.querySelector(".inner-list-typing");

    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }


    if (data.content) {
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `;
    }

    if (data.images) {
        htmlImages += `<div class="inner-images">`;

        for (const image of data.images) {
            htmlImages += `
                <img src="${image}">
            `;
        }

        htmlImages += `</div>`;
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    body.insertBefore(div, boxTyping);
    bodyChat.scrollTop = bodyChat.scrollHeight;
});
// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");

if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

// End Scroll Chat To Bottom

// Show Typing
var timeOut;

const showTyping = () => {
    const userId = document.querySelector("[my-id]").getAttribute("my-id");
    const fullName = document.querySelector("[my-fullname]")?.getAttribute("my-fullname") || "Người dùng";
    
    socket.emit("CLIENT_SEND_TYPING", {
        userId,
        fullName,
        type: "show"
    });

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", {
            userId,
            fullName,
            type: "hidden"
        });
    }, 3000);
};
// End Show Typing

// emoji-picker
// Show Popup
const buttonIcon = document.querySelector(".button-icon");

if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");

    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle("show");
    };
}

// Insert Icon To Input
const emojiPicker = document.querySelector("emoji-picker");

if (emojiPicker) {
    const inputChat = document.querySelector(
        ".chat .inner-form input[name='content']"
    );

    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;

        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping();
    });

    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
// End emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(
                `[user-id="${data.userId}"]`
            );

            if (!existTyping) {
                const boxTyping = document.createElement("div");

                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(
                `[user-id="${data.userId}"]`
            );

            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
    }
}
// End SERVER_RETURN_TYPING