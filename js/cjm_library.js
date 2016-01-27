
/*
* Module des envoies de mails
*/
var modSendEmails = (function () {
  var self = {};
  self.send_mail_confirm_paiement = function (content) {
    var data = {
      'action' : 'send_mail_confirm',
      'mail' :'true',
      'content' : content
    }
    jQuery.post(ajax_object.ajax_url,data,function (data) {
    });
  }
  self.tmce_getContent = function (editor_id, textarea_id) {
    if ( typeof editor_id == 'undefined' ) editor_id = wpActiveEditor;
    if ( typeof textarea_id == 'undefined' ) textarea_id = editor_id;

    if ( jQuery('#wp-'+editor_id+'-wrap').hasClass('tmce-active') && tinyMCE.get(editor_id) ) {
      return tinyMCE.get(editor_id).getContent();
    }else{
      return jQuery('#'+textarea_id).val();
    }
}
  return self;
})();
/*
* Module de récupération des données plugin CJM
*/
var modGetData = (function(){
    var self = {};
    function calcul_prix_resa (nbplaceE,nbplaceP,prix_enfant,prix_adulte) {
      var res;
      res = (nbplaceP*prix_adulte)+(nbplaceE*prix_enfant);
      return res;
    };
    /*
    * Aucun paramètre, fonction qui récupère les informations de l'utilisateur qui est conencté en AJAX
    Return : Object de type Promise qui contient les informations de l'utiisateur
    Pour récupérer les informations facilement il faut le faire dans une fonction de callback comme ceci
    Soit user la variable de type Promise :
    user.then(function (user) {
      console.log(user);
      //Ici user contient toutes les informations de l'utilisateur(rôle,droits,data)
    });
    */
    self.get_logged_user = function () {
       var data = {
      'action': 'get_logged_user',
      'user': ajax_object.user
      };
      return Promise.resolve(jQuery.post(ajax_object.ajax_url, data,function (data) {
        },"json"));
    };
    /*
    * Fonction qui fait un appel AJAX sur ajaxController.php pour récupérer tous les événéments
    * Param : type (il n'est pas utile pour le moment mais peut permettre de récupérer unique un type de voyage à la fois)
    */
    self.get_evenements = function (type) {
        var data = {
          'action' : 'get_evenements',
          'get_evenements' : true ,
          'type_evenement' : type
        }
          jQuery.post(ajax_object.ajax_url,data,function (data) {
        /*
        * Remplissage du tableau des voyages et des escapades
        * Requete AJAX sur ajaxController pour récupérer tous les événements
        */
        /*
        * Remplissage de l'en-tête du tableau des voyages
        */
        jQuery("#les_voyages table").append("<thead><tr></tr></thead>");
        jQuery("#les_voyages table tr").append("<th  style='width:5%;' class='manage-column'><input class='sup_voyage_class' id='check_sup_voyage_all' type='checkbox'></th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Nom du voyage</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Début</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Fin</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Nombre places</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Tarif Adulte</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Tarif Enfant</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Tarif Adherent</th>");
        jQuery("#les_voyages table tr").append("<th class='manage-column'>Etat</th>");
        /*
        * Remplissage de l'en-tête du tableau des escapades
        */
        jQuery("#les_escapades table").append("<thead><tr></tr></thead>");
        jQuery("#les_escapades table tr").append("<th  style='width:5%;' class='manage-column'><input class='sup_voyage_class' id='check_sup_voyage_all' type='checkbox'></th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Nom escapade</th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Début</th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Fin</th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Nombre places</th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Tarif Adulte</th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Tarif Enfant</th>");
        jQuery("#les_escapades table tr").append("<th class='manage-column'>Etat</th>");
        /*
        * Pour chaque Object événement ajout d'une ligne dans le tableau
        *
        */
        jQuery.each(data,function(i,e){
          var type_evenement = e.category.toLowerCase().substr(0,e.category.toLowerCase().length-1);
          jQuery("#les_"+e.category.toLowerCase()+" table").append("<tr id='"+type_evenement+""+e.ID+"'></tr>");
          var ligne = jQuery("#"+type_evenement+""+e.ID);
          ligne.append("<td><input type='checkbox' id='check_sup_"+type_evenement+""+e.ID+"' class='sup_"+type_evenement+"_class' ></td>");
          ligne.append("<td style='cursor:pointer;color:blue;'>"+e.post_title+"</td>");
          ligne.append("<td>"+e.dated+"</td>");
          ligne.append("<td>"+e.datef+"</td>");
          ligne.append("<td>"+e.nbplace+"/"+e.place_total+"</td>");
          ligne.append("<td>"+e.tarifa+"</td>");
          ligne.append("<td>"+e.tarife+"</td>");
          ligne.append("<td>"+e.tarifadh+"</td>");
          ligne.append("<td class='"+e.etat_resa+"'></td>");

        });
        /*
        * Fin du remplissage du tableau
        *
        */
      },"json")
      .done(function() {
        /*
        * Chargement des resas si les événements ont bien été chargés
        */
         modGetData.get_resas();
         modGestionCJM.admin_notif("updated","Les réservations et les événements ont bien été chargées",1500);
        })
      /*
      * Si la requête ajax échoue, petit alert des familles
      */
      .fail(function() {
        modGestionCJM.admin_notif("error","Les réservations n'ont pas été chargées.",7000);
        });
    };
    self.get_resas = function () {
          var data = {
          'action' : 'get_resas',
          'get_resas' : true ,
        }
         jQuery.post(ajax_object.ajax_url,data,function (data) {
           console.log(data);
        jQuery("#les_resas table").append("<tr></tr>");
        jQuery("#les_resas table tr").append("<th style='width:5%;' class='manage-column'><input class='sup_resa_class' id='check_sup_resa_all' type='checkbox'></th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Nom Prenom</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Nom voyage</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Nombre de places Adulte</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Nombre de places Enfant</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Date Réservation</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Prix</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Téléphone</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Paiement</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Prioritaire ?</th>");
        jQuery("#les_resas table tr").append("<th class='manage-column'>Role</th>");
        jQuery.each(data.data,function(i,e){
          var type_evenement = e.category.toLowerCase().substr(0,e.category.toLowerCase().length-1);
          var attente="";
           if(e.liste_attente==1)
          {
            attente="resa_attente";
          }
          jQuery("#les_resas table").append("<tr id='reservation"+e.id_resa+"'></tr>");
          var resa = jQuery("#reservation"+e.id_resa);
          resa.append("<td class="+attente+"><input type='checkbox' id='check_sup_resa"+e.id_resa+"' class='sup_resa_class' ></td>");
          resa.append("<td id='user"+e.id_participant+"'>"+e.display_name+"</td>");
          resa.append("<td id='"+type_evenement+""+e.id_evenement+"'>"+e.nom_voyage+"</td>");
          resa.append("<td name='nb_place_resa'>"+e.nbplace+"</td>");
          resa.append("<td name='nbplace_enf_resa'>"+e.nbplace_enf+"</td>");
          resa.append("<td>"+e.date_resa+"</td>");
          var prix_adulte = parseInt(jQuery("#"+type_evenement+""+e.id_evenement).children().eq(5).text());
          var prix_enfant = parseInt(jQuery("#"+type_evenement+""+e.id_evenement).children().eq(6).text());
          // resa.append("<td>"+String(calcul_prix_resa(parseInt(e.nbplace_enf),parseInt(e.nbplace),parseInt(prix_enfant),parseInt(prix_adulte)))+"</td>");
          resa.append("<td>"+e.prix_total+"</td>");
          resa.append("<td name='tel_resa' style='mso-number-format:\"@\"'>"+e.tel+"</td>");
           if(e.paiement==0)
          {
            resa.append("<td><input type='checkbox' id='paiement"+e.id_resa+"' class='paiement_class'></td>");
          }
          else {
            resa.append("<td><input type='checkbox' id='paiement"+e.id_resa+"' class='paiement_class' checked ></td>");
          }
           if(e.liste_attente==1)
          {
            resa.append("<td><input type='checkbox' class='att_class' id='att"+e.id_resa+"'></td>");
          }
          else {
            resa.append("<td><input type='checkbox' id='att"+e.id_resa+"' class='att_class' checked ></td>");
          }
            });
      },"json")
    .fail(function() {
      modGestionCJM.admin_notif("error","Les réservations n'ont pas été chargées.",7000);
      });
    };
    self.get_resa_by_voyage = function (id_evenement) {
      var data = {
          'action' : 'get_resa_by_voyage',
          'get_resa_by_voyage' : true ,
          'id_evenement' : id_evenement
        }
       return Promise.resolve(jQuery.post(ajax_object.ajax_url,data,function (data) {
        },"json"));
    };
    /*
    Paramètres : id_user L'ID de l'utilisateur pour lequelle on veut récupérer ses informations
    Return : Object de type Promise qui contient les informations de l'utiisateur
    Pour récupérer les informations facilement il faut le faire dans une fonction de callback comme ceci
    Soit user la variable de type Promise :
    user.then(function (user) {
      console.log(user);
      //Ici user contient toutes les informations de l'utilisateur(rôle,droits,data)
    });
    */
    self.get_user_by_id = function (id_user) {
      var data = {
          'action' : 'get_user_by_id',
          'user_by_id' : true ,
          'id_user' : id_user
        }
      return Promise.resolve(jQuery.post(ajax_object.ajax_url,data,function (data) {
      },"json"));
    };
    return self;
})();
/*
* Module de gestion des données (réservation & événements)
*
*/
var modGestionCJM = (function(){
  var self = {};
  self.reloadData = function (get_param) {
    jQuery("#les_resas table").html("");
    jQuery("#les_escapades table").html("");
    jQuery("#les_voyages table").html("");
    if(get_param.post_type=="reservation" && get_param.page=="my-custom-submenu-page")
    {
      modGetData.get_evenements("Les voyages");
    }
    jQuery("#les_resas").hide();
  };
  self.admin_notif = function (class_name,message,duration) {
      if(jQuery("#messsage_notif").length!=0)
        jQuery("#messsage_notif").remove();
      jQuery("#master_titre_resa").after("<div style='display:none;' id='messsage_notif' class=\""+class_name+" is-dismissible notice\"></div>");
      jQuery("#messsage_notif").prepend("<p>"+message+"</p>");
      jQuery("#messsage_notif").fadeIn();
      setTimeout(function(){
         jQuery("#messsage_notif").fadeOut();
    }, duration);
  };
  self.add_resa = function () {
    var datatemp = [];
    jQuery("#add_resa_form").children("input,select").each(function (i,e) {
      if(jQuery(e).val()=="")
      {
        console.log("Des élements sont vides");
      }
      else {
        if(jQuery(e).attr('type')=='checkbox')
        {
          datatemp.push(jQuery(e).is(':checked'));
        }
        else {
          datatemp.push(jQuery(e).val());
        }
      }
    });
    datatemp.push(jQuery("#add_resa_form").attr('voyage').replace('voyage','').replace('escapade',''));
    var data = {
      'action' : 'add_resa',
      'nom' : datatemp[0],
      'nbplace' : datatemp[1],
      'nbplace_enf' : datatemp[2],
      'tel' : datatemp[3],
      'paiement' : datatemp[4],
      'liste_attente' : datatemp[5],
      'id_evenement' : datatemp[datatemp.length-1],
      'role' : datatemp[6]
    };
    jQuery.post(ajax_object.ajax_url,data, function (data) {
      data = JSON.parse(data);
      var paiement=''
      var attente='';
      jQuery("#les_resas table").append("<tr id='new_reservation'></tr>");
      var resa = jQuery("#new_reservation");
      resa.append("<td><input type='checkbox' class='sup_resa_class' ></td>");
      resa.append("<td>"+data[0].nom+"</td>");
      resa.append("<td></td>");
      resa.append("<td name='nb_place_resa'>"+data[0].nbplace+"</td>");
      resa.append("<td name='nbplace_enf_resa'>"+data[0].nbplace_enf+"</td>");
      resa.append("<td>"+new Date().toJSON().slice(0,10)+"</td>");
      resa.append("<td>"+data[0].prix_total+"</td>");
      resa.append("<td>"+data[0].tel+"</td>");
      if(data[0].paiement){paiement='checked'};
      if(data[0].atente){attente='checked'};
      resa.append("<td><input type='checkbox' class='sup_resa_class' "+paiement+"></td>");
      resa.append("<td><input type='checkbox' class='sup_resa_class' "+attente+"></td>");
    });
  };
  function modif_resa_ajax (ress) {
       var data = {
        'action' : 'modif_resa',
        'id' : ress[ress.length-3] ,
        'nbplace' : ress[3] ,
        'nbplace_enf' : ress[4],
        'tel' : ress[7],
        'id_user' : ress[ress.length-2],
        'table' : ress[ress.length-1]
      }
    jQuery.post(ajax_object.ajax_url,data, function (msg) {
      console.log(msg);
    },"json")
    .fail(function() {
        modGestionCJM.admin_notif("error","La modification a échoué",5000);
        })
    .done(function () {
        modGestionCJM.admin_notif("updated","Modification réussie",2000);
    });
  };
  self.modif_resa = function () {
    var user_id;
    var table_id="";
    var patt = new RegExp("ext");
    var checks = jQuery(".sup_resa_class:checked").attr('id');
    var res = checks.match(/\d+/);
    var isExt = patt.test(checks);
    if(isExt)
    {
      table_id="ext";user_id=res[0];
    }
    jQuery("#reservation"+res[0]+table_id).children().each(function(i,e)
    {
      var textElement = jQuery(e).html();
      if(!jQuery(e).children().is("input") && i!=1 && i!=2 && i!=6 && i!=5)
      {
        var name = jQuery(e).attr('name');
        jQuery(e).html("<input style=\"width:100px;\" name='modif_"+name+"' type='text' value='"+textElement+"'></input>");
        if(i==3 || i==4)
        {
           jQuery(e).html("<input style=\"width:50px;\" name='modif_"+name+"' type='number' value='"+textElement+"'></input>");
        }

      }

    });
    if(jQuery("#register_modif_resa").length==0)
    {
      jQuery("<input type='button' value='Enregistrer' class='button action' id='register_modif_resa'>").insertAfter('#app_resa');
    }
    jQuery("body").off("click","#register_modif_resa");
    jQuery("body").on("click","#register_modif_resa",function () {
      var infos= [];
      var vals = [3,4,7];
      var ress = [];
      jQuery("#les_resas").find("table").find("tbody").find("tr").each(function(i,e)
      {
        if(i!=0)
        {
          if(jQuery(e).css('display')=='table-row' && typeof jQuery(e) != 'undefined')
          {
            infos[i]= jQuery(e);
          }
        }
      });
      if(typeof user_id == "undefined")
      {
          user_id = jQuery("#reservation"+res[0]).children().eq(1).attr('id').match(/\d+/);
      }
      for(val in vals) {
        if(vals[val]==8 || vals[val]==9 ){
            ress[vals[val]]=jQuery("#reservation"+res[0]+table_id).children("td").eq(vals[val]).children('input').is(':checked');
          }
        else {
            ress[vals[val]]=jQuery("#reservation"+res[0]+table_id).children("td").eq(vals[val]).children('input').val();
          }
      }
      ress.push(res[0]);
      ress.push(user_id[0]);
      ress.push(table_id);
      modif_resa_ajax(ress);
      });
  };
  self.sup_voyage = function () {
    var checks = jQuery(".sup_voyage_class:checked").attr('id');
    var res = checks.match(/\d+/);
     var data = {
        'action' : 'sup_voyage',
        'id' : res[0] ,
        'delete_voyage' : true
      }
    jQuery.post(ajax_object.ajax_url,data, function (data) {
      jQuery("#voyage"+res).hide();
    },"json")

    .fail(function() {
        modGestionCJM.admin_notif("error","Le voyage n'a pas été supprimé.",5000);
        })
    .done(function () {
        modGestionCJM.admin_notif("updated","Le voyage a bien été supprimé.",2000);
    });
  }
    self.sup_escapade = function () {
    var checks = jQuery(".sup_escapade_class:checked").attr('id');
    var res = checks.match(/\d+/);
     var data = {
        'action' : 'sup_escapade',
        'id' : res[0] ,
        'delete_escapade' : true
      }
    jQuery.post(ajax_object.ajax_url,data, function (data) {
      jQuery("#escapade"+res).hide();
    },"json")
    .fail(function() {
        modGestionCJM.admin_notif("error","L'escapade n'a pas été supprimé.",5000);
        })
    .done(function () {
        modGestionCJM.admin_notif("updated","L'escapade a bien été supprimé.",2000);
    });
  }

  self.sup_resa = function () {
    var table_id="";
    var patt = new RegExp("ext");
    var checks = jQuery(".sup_resa_class:checked").attr('id');
    var res = checks.match(/\d+/);
    var isExt = patt.test(checks);
    if(isExt)
    {
      table_id="ext";
    }
    var id_evenement = jQuery("#reservation"+res[0]+table_id+" td").eq(2).html();
    var data = {
        'action' : 'sup_resa',
        'delete_resa' : true ,
        'id_resa' :  res[0],
        'table': table_id
      }
    jQuery.post(ajax_object.ajax_url,data, function (data) {
      console.log(data);
      jQuery("#reservation"+res[0]+table_id).remove();
    },"json")
    .fail(function() {
        modGestionCJM.admin_notif("error","La réservation n'a pas été supprimé.",5000);
        })
    .done(function () {
        modGestionCJM.admin_notif("updated","La réservation a bien été supprimé.",2000);
    });
  }

  self.change_paiement_resa = function (id_resa,paiement,table) {
      var data = {
          'action' : 'change_paiement_resa',
          'paiement' : paiement ,
          'id_resa' : id_resa,
          'table' : table
        }
      jQuery.post(ajax_object.ajax_url,data, function (data) {
      }, "json"

    )
    .done (function () {
      modGestionCJM.admin_notif("updated","Paiement mis à jour",1500);

    });
  };
  self.change_att_resa = function (id_resa,att,table) {
      var data = {
          'action' : 'change_att_resa',
          'att' : att ,
          'id_resa' : id_resa ,
          'table' : table
        }
      jQuery.post(ajax_object.ajax_url,data, function (data) {
      }, "json"

    )
    .done (function () {
      modGestionCJM.admin_notif("updated","Liste d'attente mise à jour",1500);

    });
  };
  self.GET = function (param) {
  var vars = {};
  window.location.href.replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function( m, key, value ) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );
  if ( param ) {
    return vars[param] ? vars[param] : null;
      }
    return vars;
  };

  return self;



  })();
