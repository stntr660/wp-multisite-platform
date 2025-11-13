@extends('wpbox::website.layout')

@section('content')
<main class="mb-5">
        <section class="mt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <div>
                            <h1>Get in touch!</h1>
                            <div>
                                <p><span style="text-decoration: underline;text-decoration-color: #A7D26D;text-decoration-thickness: 4px;">with WhatsApp&nbsp;&nbsp;</span>To contact us, simply click on the WhatsApp<br>button located at the bottom right of any page on<br>our website. Alternatively, you can also reach out<br>to us via email at:</p>
                            </div>
                        </div><img class="w-100" width="" height="" src="assets/img/Fichier%2079.svg">
                        <div class="w-100 text-center mt-4"></div>
                    </div>
                    <div class="col-md-6 p-0">
                        <section class="position-relative">
                            <div class="container position-relative">
                                <div class="row d-flex justify-content-center p-0">
                                    <div class="col col-12">
                                        <div class="card" style="border: 1px solid black;border-image: linear-gradient(to bottom, rgba(108,219,141,0) 25%,black 25%,rgb(167,210,109,1) 75%,rgba(108,220,141,0) 75%);border-image-slice: 1;border-right: none;">
                                            <div class="card-body text-center p-sm-5">
                                                <div>
                                                    <div class="mb-3"><input class="form-control" type="text" id="name-2" name="name" placeholder="Full name"></div>
                                                    <div class="mb-3"><input class="form-control" type="email" id="email-2" name="email" placeholder="Email"></div>
                                                    <div class="mb-3"><input class="form-control" type="email" id="email-1" name="email" placeholder="Phone number"></div>
                                                    <div class="mb-3"><textarea class="form-control" id="message-2" name="message" rows="6" placeholder="Message"></textarea></div>
                                                    <div>
                                                        <a class="btn btn-primary w-100 border-0" role="button" href="{{ route('thankyou') }}" style="border-radius: 12px; background: #A7D26D;">Send</a>

                                                    </div>
                                                </div>
                                                <div class="pt-2"><img><img><img></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection