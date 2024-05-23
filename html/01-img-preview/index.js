document.querySelector('input').addEventListener('change',function(){
    if(this.files.length){
        const img = document.querySelector('img')
        img.src = URL.createObjectURL(this.files[0])
        img.onload = ()=>{
            URL.revokeObjectURL(img.src)
        }
    }
})