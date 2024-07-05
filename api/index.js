// $("button").on("click", () => {
//     $("img").attr(
//       "src",
//       "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/IMG_Academy_Logo.svg/800px-IMG_Academy_Logo.svg.png"
//     );
// })

setupUi();
//-------------------------------
// hide alertmassege
// function hideAlert() {
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       $("#success-alert").fadeOut("slow");
//       resolve();
//     }, 1500);

//   }).then(() => {
//     setTimeout(() => {
// window.location.reload()
//     }, 1000);
//   })
// }
// function to get all posts
const baseUrl = "https://tarmeezacademy.com/api/v1";
async function getPosts() {
  let res = await axios.get(`${baseUrl}/posts`);

  let posts = await res.data.data;
  for (post of posts) {
    let divs = `
                  <div class="card shadow my-3">
              <div class="card-header">
                <img
                  src="${post.author.profile_image}"
                  class="rounded-circle border border-2"
                  width="40px"
                  height="40px"
                  alt=""
                />
                <p id="user" class="d-inline">${post.author.username}</p>
              </div>
              <div class="card-body">
                <img
                  src="${post.image}"
                  class="w-100"
                  alt=""
                />
                <h6 class="mt-1" style="color: rgb(193, 193, 193)">
                ${post.created_at}
                </h6>
                <h5>${post.author.name}</h5>
                <h5>${post.title}</h5>
                <p>
         ${post.body}
                </p>
                <hr />

                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pen"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                    />
                  </svg>
                  <span> (${post.comments_count}) comments

                  <span id="post-tags-${post.id}" >
            
             
                  </span>
                                    </span>
                                    

                </div>
                
              </div>
            </div>
      
      `;
    document.querySelector("#posts").innerHTML += divs;
    const currentPostId = `post-tags-${post.id}`;

    for (tag of post.tags) {
      console.log(tag.name);
      let tagsContent = `
        <button class="btn btn-sm  rounded-5" style="background-color:gray; color:white ; width: 100px;"
        ${tag.name}
        </button>
        `;
      document.getElementById(currentPostId).innerHTML += tagsContent;
    }
  }
}

getPosts();

// loginBtnClick function
function loginBtnClick() {
  const userN = $("#email").val();
  const pass = $("#password").val();

  const params = {
    username: userN,
    password: pass,
  };
  const url = `${baseUrl}/login`;
  axios.post(url, params).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    document.getElementById("pro-name").innerHTML =
      "Welcome " + JSON.parse(localStorage.getItem("user")).username;

    modelHide("login-model");
    // showMassege("Login Successfully!");
    setupUi();

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Logged in successfully!",
      showConfirmButton: false,
      timer: 1500,
    });
  });
}
// end  loginBtnClick Function

//-------------------------------------------------------------------------

// create POST FUNCTION

async function createpost() {
  let token = localStorage.getItem("token");
  let config = { headers: { Authorization: "Bearer " + token } };
  const titles = $("#name-input-post").val();
  const bodys = $("#body-input-post").val();
  let profile = await axios.post(
    "https://tarmeezacademy.com/api/v1/posts",
    {
      title: titles,
      body: bodys,
    },
    config
  );
  modelHide("addPostDiv");
  console.log("this is the function");
}
// ---------------------------------------------------------------------------
// registerBtnClick() function to register new user
function registerBtnClick() {
  const userName = $("#username-input").val();
  const password = $("#password-input").val();
  const name = $("#name-input").val();
  console.log(name, userName, password);

  const params = {
    username: userName,
    password: password,
    name: name,
  };
  const url = `${baseUrl}/register`;
  axios
    .post(url, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      modelHide("register-model");

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your account has been created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      hideAlert();
      setupUi();

      // showMassege("Welcome Back!")
    })
    .catch((error) => {
      const massege = error.response.data.message;
      modelHide("register-model");
      showMassege(massege, "danger");
      hideAlert();
    });
}
// logout button
//---------------------------------------------------------------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // showMassege("Logout Successfully!");
  document.getElementById("pro-name").innerHTML = "";
  setupUi();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: " You have logged out.",
    showConfirmButton: false,
    timer: 1500,
  });
}
// ----------------------------------------------------------------------

// -------------------------------------------------------------------------------------

// to show the logout btn

function setupUi() {
  const token = localStorage.getItem("token");
  const logdiv = $("#login-div");
  const logoutdiv = $("#logout-div");
  const addBtn = $("#add-btn");
  if (token == null) {
    logdiv.attr("style", "display:flex !important");
    logoutdiv.attr("style", "display:none !important");
    addBtn.attr("style", "display:none !important");
  } else {
    logdiv.attr("style", "display:none !important");
    logoutdiv.attr("style", "display:flex !important");
    addBtn.attr("style", "display:block !important");
  }
}

// function to hide the model
function modelHide(modelName) {
  const modal = document.getElementById(modelName);
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

// function loginFun() {
//   let userN = $("#email").val();
//   let pass = $("#password").val();
//   async function login() {
//     let response = await axios.post("https://tarmeezacademy.com/api/v1/login", {
//       username: userN,
//       password: pass,
//     });
//     let re = await response;
//     console.log(re);
//     let token = await response.data.token;

//       localStorage.setItem("userToken", token);
//       createpost()

//   }

// async function createpost() {

//   let token = localStorage.getItem("userToken");
//   let config = { headers: { Authorization: "Bearer " + token } };
//   let profile = await axios.get("https://tarmeezacademy.com/api/v1/users", {
//     username: userN,
//     password: pass,
//   }, config);

//   let users = await profile.data.data;
//   document.querySelector("#posts").innerHTML = "";

//   for (post of users) {
//     let divs = `
//                 <div class="card shadow my-3">
//             <div class="card-header">
//               <img
//                 src="${post.profile_image}"
//                 class="rounded-circle border border-2"
//                 width="40px"
//                 height="40px"
//                 alt=""
//               />
//               <p id="user" class="d-inline">${post.username}</p>
//             </div>
//             <div class="card-body">
//               <img
//                 src="${post.profile_image}"
//                 class="w-100"
//                 alt=""
//               />
//               <h6 class="mt-1" style="color: rgb(193, 193, 193)">
//               ${post.created_at}
//               </h6>
//               <h5>${post.name}</h5>
//               <p>
//        ${post.email}
//               </p>
//               <hr />

//               <div>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   fill="currentColor"
//                   class="bi bi-pen"
//                   viewBox="0 0 16 16"
//                 >
//                   <path
//                     d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
//                   />
//                 </svg>
//                 <span> (${post.comments_count}) comments </span>
//               </div>
//             </div>
//           </div>

//     `;
//     document.querySelector("#posts").innerHTML += divs;
//   }

// }
//       login();

// }
