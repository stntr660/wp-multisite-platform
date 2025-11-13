</style>
<div class="card-footer d-block" style="padding: 1.25rem">
    <div class="align-items-center">
        <div class="d-flex">
            <!-- <button v-if="!mobileChat" type="button" class="btn btn-outline" id="emoji-btn"> 
                😀
            </button>-->
            <button type="button" style=" 
            outline: none !important;     
        background: none !important; 
        border: none !important;
        padding: 0 !important;
        margin: 5px;
        cursor: pointer !important;
        " @click="openImageSelector">
                <img src="{{ asset('assets/img/Export.svg') }}" alt="upload" style="margin:0px !important;width: 2.5em !important;filter: invert(56%) sepia(1%) saturate(6952%) hue-rotate(26deg) brightness(109%) contrast(77%) !important;">

            </button>


            <button type="button" style=" 
            outline: none !important;     
        background: none !important; 
        border: none !important;
        padding: 0 !important;
        margin: 5px;
        cursor: pointer !important;
        " @click="openFileSelector">
                <img src="{{ asset('assets/img/UploadFiles.svg') }}" alt="upload" style="margin:0px !important;width: 2em !important;filter: invert(56%) sepia(1%) saturate(6952%) hue-rotate(26deg) brightness(109%) contrast(77%) !important;">

            </button>

            <input accept="image/*, video/*, audio/*" @change="handleImageChange" type="file" ref="imageInput" style="display: none" />
            <input accept=".pdf, .doc, .docx" @change="handleFileChange" type="file" ref="fileInput" style="display: none" />


            <div class="input-group">

                <input @keyup.enter="sendChatMessage" v-model="activeMessage" type="text" id="message" class="form-control" placeholder="{{ __('Type here') }}" aria-label="{{ __('Message') }}">

            </div>
            <style>





            </style>
            <button style=" 
            outline: none !important;     
        background: none !important; 
        border: none !important;
        padding: 0 !important;
        margin: 5px;
        cursor: pointer !important;
        " class="send-message-button" @click="sendChatMessage">
                <img src="{{ asset('assets/img/SendMessage.svg') }}" alt="Send message" style="margin:0px !important;width: 2.5em !important;">
            </button>
        </div>
    </div>
</div>