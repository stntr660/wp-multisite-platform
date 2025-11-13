<div class="col-lg-4 col-6 my-auto ps-0 align-right" style="text-align: right">
    
    <b-button v-if="!mobileChat" class="btn btn-icon btn-outline" v-b-modal.modal-templates style="background-color: buttonface; !important; border-color: buttonface; box-shadow:0px 0px 0px !important;">
        
    <img src="{{ asset('assets/img/Templates.svg') }}" alt="Templates" style="margin:0px !important;width: 20px !important;" class="nav-icon">
          
          
    </b-button>



    <b-modal id="modal-templates" scrollable hide-backdrop content-class="shadow" title="{{__('Send template message')}}">
        <div class="table-responsive">
            <div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">🔍</span>
                        </div>
                        <input type="text" v-model="filterTemplates" class="form-control" placeholder="{{ __('Search') }}" aria-label="seeach" aria-describedby="basic-addon1">
                    </div>
                </div>
                <table class="table align-items-center">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col" class="sort" data-sort="name">{{ __('Template')}}</th>
                            
                        </tr>
                    </thead>
                    <tbody class="list">
                        <tr  v-for="(template) in filteredTemplates">
                            <td class="">
                                <a :href="'/campaigns/create?template_id='+template.id+'&send_now=on&contact_id='+activeChat.id" ><span class="name mb-0 text-sm">@{{ template.name }}</span></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </b-modal>

    <b-button class="btn btn-icon btn-outline" type="button" v-b-modal.modal-replies style="background-color: buttonface; !important; border-color: buttonface; box-shadow:0px 0px 0px !important;">
    <img src="{{ asset('assets/img/Backtoyouraccount.svg') }}" alt="back" style="margin:0px !important;width: 20px !important;" class="nav-icon">
    </b-button>

    <b-modal id="modal-replies" scrollable hide-backdrop content-class="shadow" title="{{__('Quick replies')}}">
        <div class="table-responsive">
            <div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">🔍</span>
                        </div>
                        <input type="text" v-model="filterText" class="form-control" placeholder="{{ __('Search') }}" aria-label="seeach" aria-describedby="basic-addon1">
                    </div>
                </div>
                <table class="table align-items-center">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col" class="sort" data-sort="name">{{ __('Reply')}}</th>
                            <th scope="col" class="sort" data-sort="name">
                                <div class="d-flex justify-content-end">
                                    <b-button pill class="btn btn-default btn-sm" href="{{ route('replies.index',['type'=>'qr'])}}">
                                        <b>{{ __('Manage Quick replies') }}</b>
                                    </b-button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="list">
                        <tr v-for="(reply, index) in filteredReplies">
                            <td colspan="2" class="">
                                <span @click="setMessage(reply.text)" class="name mb-0 text-sm">@{{ reply.name }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </b-modal>

   
   




</div>