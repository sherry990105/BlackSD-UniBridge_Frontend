const mentoInfo = document.querySelectorAll(".mentoInfo")
const matching = document.querySelectorAll(".matching");

mentoInfo.forEach((mentoInfo,index)=>{

matching[index].addEventListener("click", () => {
  
  location.href = "/html/user/mentorSearch/mentorDetail/MentorDetail.html";
})
})
