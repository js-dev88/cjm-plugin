<?php
/*
Plugin Name: Réservation
Description: Plugin de réservation de voyages et d'escapades
Author: SEBIRE Florian & SAUSSIER Julien
Version: 1.0
*/
add_action('admin_menu', 'plugin_setup_menu');
add_action( 'admin_enqueue_scripts', 'enqueuescript' );
add_action( 'wp_enqueue_scripts', 'enqueuescriptclient' );
add_shortcode('my_test', "shortcode");
function shortcode () {
	ob_start();
	add_voyage();
}
function enqueuescript(){
        if($_GET["page"]!="my-custom-submenu-page2")
        {
          wp_enqueue_style('style',plugins_url('cjm/style.css'),'2.0');
        }
        wp_enqueue_script( 'cjm2',plugins_url('cjm/js/customAdmin.js'),'1.0');
				/*
				Scipts qui ne sont chargés que sur Réservation
				*/
				if(isset($_GET["post_type"]) && $_GET["post_type"]=="reservation"){
				wp_enqueue_script( 'cjm_library',plugins_url('cjm/js/cjm_library.js'),'1.0');
				/*
				Scipts qui ne sont chargés que sur Réservation=>Gestion des participants
				*/
				if($_GET["page"]=="my-custom-submenu-page"){
        wp_enqueue_script( 'cjm',plugins_url('cjm/js/cjm_main.js'),'1.0');
        wp_enqueue_script( 'cjm_export_excel',plugins_url('cjm/js/jquery.table2excel.js'),'1.0');
        wp_enqueue_script( 'cjm_export_pdf1',plugins_url('cjm/js/html2pdf/tableExport.js'),'1.0');
        wp_enqueue_script( 'cjm_export_pdf2',plugins_url('cjm/js/html2pdf/jquery.base64.js'),'1.0');
        wp_enqueue_script( 'cjm_export_pdf3',plugins_url('cjm/js/html2pdf/sprintf.js'),'1.0');
        wp_enqueue_script( 'cjm_export_pdf4',plugins_url('cjm/js/html2pdf/jspdf.js'),'1.0');
        wp_enqueue_script( 'cjm_export_pdf5',plugins_url('cjm/js/html2pdf/base64.js'),'1.0');
				}
				if($_GET["page"]=="my-custom-submenu-page2")
				{
					wp_enqueue_style('style','https://cdn.datatables.net/1.10.10/css/jquery.dataTables.min.css','2.0');
					wp_enqueue_script( 'datables_js','https://cdn.datatables.net/1.10.10/js/jquery.dataTables.min.js','1.0');
					wp_enqueue_script( 'cjm_stats',plugins_url('cjm/js/stats/main.js'),'1.0');
				}
        wp_localize_script( 'cjm_library', 'ajax_object',
        array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'user' => "true" ));

				}

}
//scripts js de gestions des forms crud resa
function enqueuescriptclient(){
        wp_enqueue_script( 'cjm_gestion_form_client',plugins_url('cjm/js/cjm_gestion_form_client.js'),'1.0');
        wp_enqueue_style('style',plugins_url('cjm/style_client.css'),'2.0');
}
/*
Modification du type des mails pour le passer en HTML
*/
add_filter( 'wp_mail_content_type', 'set_content_type' );
function set_content_type( $content_type ) {
  return 'text/html';
}

function plugin_setup_menu(){
        add_submenu_page( 'edit.php?post_type=reservation', 'Gestion des participants', 'Gestion des participants', 'manage_options', 'my-custom-submenu-page', 'display_cjm_content' );
        add_submenu_page( 'edit.php?post_type=reservation', 'Statistique', 'Statistique', 'manage_options', 'my-custom-submenu-page2', 'display_cjm_stats' );
	}
include_once("ajaxControllerv2.php");
function display_cjm_stats () {
  echo "<h1>Stats</h1>";
  echo "<table id='resas' class='display' cellspacing='0' width='100%'>
        <thead>
            <tr>
                <th>Nom Prénom</th>
                <th>Nom Evenement</th>
                <th>Nombre place</th>
                <th>Nombre place enfants</th>
                <th>Prix total</th>
                <th>Téléphone</th>
								<th>Paiement</th>
								<th>Priorité</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
							<th>Nom Prénom</th>
							<th>Nom Evenement</th>
							<th>Nombre place</th>
							<th>Nombre place enfants</th>
							<th>Prix total</th>
							<th>Téléphone</th>
							<th>Paiement</th>
							<th>Priorité</th>
            </tr>
        </tfoot>
    </table>";
}
function display_cjm_content() {
        echo "<div class='icon-cjm-resa'></div>";
      echo "<h1 id='master_titre_resa'>Gestions des participants</h1>";
      echo "<h2 class='nav-tab-wrapper'>";
      echo "<img id='reload_all' src='../wp-content/plugins/cjm/img/refresh.png' style='cursor:pointer;float:right;margin-right:10px;'></img>";
      echo "<a id='les_voyages_titre' class='nav-tab'>Les voyages</a>";
      echo "<a id='les_escapades_titre' class='nav-tab'>Les Escapades</a>";
      echo "<a id='les_mails_titre' class='nav-tab'>Les Mails</a>";
      echo "</h2>";
      /*
      Les voyages
      */
      echo "<div id='les_voyages' style='display:none;'>";
      echo "<h1>Les voyages</h1>";
      echo
      "<select id='voyages_action'>
            <option selected=\"selected\">Action</option>
            <option value=\"Supprimer\">Supprimer</option>
            <option value=\"Modifier\">Modifier</option>
      </select>";
      echo "<input type='submit' class='button action' value='Appliquer' id='app_voyage'>";
      echo "<table style='border:solid;' class='wp-list-table widefat fixed striped posts'>";
      echo "</table>";
      echo "</div>";
      /*
      Les escapades
      */
      echo "<div id='les_escapades' style='display:none;'>";
      echo "<h1>Les Escapades</h1>";
      echo
      "<select id='escapdes_action'>
            <option selected=\"selected\">Action</option>
            <option value=\"Supprimer\">Supprimer</option>
            <option value=\"Modifier\">Modifier</option>
      </select>";
      echo "<input type='submit' class='button action' value='Appliquer' id='app_escapade'>";
      echo "<table style='border:solid;' class='wp-list-table widefat fixed striped posts'>";
      echo "</table>";
      echo "</div>";
      /*
      Les réservations
      */
      echo "<div id='les_resas' style='display:none;'>";
      echo "<h1>Les Réservations</h1>";
      echo
      "<select id='resa_action'>
            <option selected=\"selected\">Action</option>
            <option value=\"Supprimer\">Supprimer</option>
            <option value=\"Modifier\">Modifier</option>
      </select>";
      echo "<input type='submit' class='button action' value='Appliquer' id='app_resa'>";
      echo "<table style='border:solid;' class='wp-list-table widefat fixed striped posts'>";
      echo "</table>";
      echo
      "<select id='export_resas'>
            <option  value =\"PDF\" selected=\"selected\">PDF</option>
            <option value=\"Excel\">Excel</option>
      </select>";
      echo "<input type='button' class='button action' value='Exporter' id='btn_export_resa'>";
      echo "<div id='add_resa_form'>";
      echo "<input name='add_name' type='text' placeholder='Nom prénom'></input>";
      echo "<label>Nombre place adulte</label><input type='number'></input>";
      echo "<label>Nombre de place enfant</label><input type='number'></input>";
      echo "<input name='add_tel' type='text' placeholder='Téléphone'></input>";
      echo "<label>Paiement :</label><input name='add_paiement' type='checkbox'></input>";
      echo "<label>Liste attente :</label><input name='add_list' type='checkbox'></input>";
      echo
      "<select id='add_role'>
            <option  value =\"adherent\" selected=\"selected\">Adhérent</option>
            <option value=\"noadherent\">Non Adhérent</option>
      </select>";
      submit_button( 'Ajouter réservation',"primary","add_resa" );
      echo "</div>";
      echo "</div>";
      /*
      * Les mails
      */
      echo "<div id='les_mails'>";
      echo "<div>";
      // wp_editor("<p><strong>Coucou</strong></p>","test_mail");submit_button( 'Save content' );

}

add_action( 'init', 'register_cpt_resa' );
function my_admin_notice($class,$message) {
    echo"<div class=\"$class is-dismissible notice\"> <p>$message</p>
          <button type='button' class='notice-dismiss'>
      <span class='screen-reader-text'>Ne pas tenir compte de ce message </span>
      </button>
    </div>";
}

function register_cpt_resa() {

    $labels = array(
        'name' => _x( 'Réservation', 'reservation' ),
        'singular_name' => _x( 'Réservation', 'reservation' ),
        'add_new' => _x( 'Ajouter', 'reservation' ),
        'add_new_item' => _x( 'Ajouter une réservation', 'reservation' ),
        'edit_item' => _x( 'Editer une réservation', 'reservation' ),
        'new_item' => _x( 'Nouvelle réservation', 'reservation' ),
        'view_item' => _x( 'Voir la réservation', 'reservation' ),
        'search_items' => _x( 'Rechercher une réservation', 'reservation' ),
        'not_found' => _x( 'Aucune réservation trouvée', 'reservation' ),
        'not_found_in_trash' => _x( 'Aucune réservation dans la corbeille', 'reservation' ),
        'parent_item_colon' => _x( 'Réservation parente :', 'reservation' ),
        'menu_name' => _x( 'Réservation', 'reservation' ),
    );

    $args = array(
        'labels' => $labels,
        'hierarchical' => false,
        'description' => 'Les Réservations',
        'supports' => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'revisions' ),
        'taxonomies' => array( 'category'),
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,

        'show_in_nav_menus' => true,
        'publicly_queryable' => true,
        'exclude_from_search' => false,
        'has_archive' => true,
        'query_var' => true,
        'can_export' => true,
        'rewrite' => true,
        'capability_type' => 'post'
    );

    register_post_type( 'reservation', $args );

}

//  meta box reservation
 add_action('add_meta_boxes','init_metabox');
function init_metabox(){
  add_meta_box('info_crea', 'Informations Réservations', 'info_crea', 'reservation', 'normal');
}

function info_crea($post){
  $date_debut = get_post_meta($post->ID,'_date_debut',true);
  $date_fin = get_post_meta($post->ID,'_date_fin',true);
  $nb_place = get_post_meta($post->ID,'_nb_place',true);
  $nb_place_total = get_post_meta($post->ID,'_nb_place_total',true);
  $tarif_adulte = get_post_meta($post->ID,'_tarif_adulte',true);
  $tarif_enfant = get_post_meta($post->ID,'_tarif_enfant',true);
  $tarif_adherent = get_post_meta($post->ID,'_tarif_adherent',true);
  $nom_voyage = get_post_meta($post->ID,'_nom_voyage',true);
  $etat_resa = get_post_meta($post->ID,'_etat_resa',true);
  echo '<label class="lbl_resa" for="nom_voyage">Nom de l\'évènement: </label>';
  echo '<input class="ipt_resa" id="nom_voyage_meta" type="text" name="nom_voyage" value="'.esc_attr($nom_voyage).'" />';
  echo '<label class="lbl_resa" for="date_debut">Date début : </label>';
  echo '<input class="ipt_resa" placeholder="JJ-MM-AAAA" id="date_debut_meta" type="text" name="date_debut" value="'.esc_attr($date_debut).'" />';
  echo '<label class="lbl_resa" for="date_fin">Date fin : </label>';
  echo '<input class="ipt_resa" placeholder="JJ-MM-AAAA" id="date_fin_meta" type="text" name="date_fin" value="'.esc_attr($date_fin).'" />';
  echo '<label class="lbl_resa" for="nb_place">Places Disponibles : </label>';
  echo '<input class="ipt_resa" id="nb_place_meta" type="text" name="nb_place" value="'.esc_attr($nb_place).'" />';
  echo '<label class="lbl_resa" for="nb_place_total">Places Totales : </label>';
  echo '<input class="ipt_resa" id="nb_place_total_meta" type="text" name="nb_place_total" value="'.esc_attr($nb_place_total).'" />';
  echo '<label class="lbl_resa" for="tarif_adulte">Tarifs Adultes : </label>';
  echo '<input class="ipt_resa" id="tarif_adulte_meta" type="text" name="tarif_adulte" value="'.esc_attr($tarif_adulte).'" />';
  echo '<label class="lbl_resa" for="tarif_enfant">Tarifs Enfants : </label>';
  echo '<input class="ipt_resa" id="tarif_enfant_meta" type="text" name="tarif_enfant" value="'.esc_attr($tarif_enfant).'" />';
  echo '<label class="lbl_resa" for="tarif_adherent">Tarifs Adhérent : </label>';
  echo '<input class="ipt_resa" id="tarif_adherent_meta" type="text" name="tarif_adherent" value="'.esc_attr($tarif_adherent).'" />';
  echo '<label class="lbl_resa" for="etat_resa">Etat Réservation : </label>';
  echo '<select name="etat_resa">';
     echo '<option value="ouvert" ';
     if($etat_resa == 'ouvert'){echo 'selected = "selected"';};
     echo '>Ouvert</option>';
     echo '<option value="file_attente" ';
     if($etat_resa == 'file_attente'){echo 'selected = "selected"';}
     echo '>File d\'attente</option>';
     echo '<option value="cloture" ';
     if($etat_resa == 'cloture'){echo 'selected = "selected"';}
      echo '>Cloturé</option>';
  echo '</select>';

}

add_action('save_post','save_metabox');
function save_metabox($post_id){
if(isset($_POST['date_debut'])
  &&isset($_POST['date_fin'])
  &&isset($_POST['nom_voyage'])
  &&isset($_POST['nb_place'])
  &&isset($_POST['nb_place_total'])
  &&isset($_POST['etat_resa'])
  &&isset($_POST['tarif_adulte'])
  &&isset($_POST['tarif_adherent'])
  &&isset($_POST['tarif_enfant']))
  update_post_meta($post_id, '_date_debut', $_POST['date_debut']);
  update_post_meta($post_id, '_date_fin', $_POST['date_fin']);
  update_post_meta($post_id, '_nb_place', $_POST['nb_place']);
  update_post_meta($post_id, '_nb_place_total', $_POST['nb_place_total']);
  update_post_meta($post_id, '_tarif_adulte', $_POST['tarif_adulte']);
  update_post_meta($post_id, '_tarif_enfant', $_POST['tarif_enfant']);
  update_post_meta($post_id, '_tarif_adherent', $_POST['tarif_adherent']);
  update_post_meta($post_id, '_nom_voyage', $_POST['nom_voyage']);
  update_post_meta($post_id, '_etat_resa', $_POST['etat_resa']);
  $res = add_post_meta($post_id,'_date_debut', $_POST['date_debut'],true);
  if(!$res)
    update_post_meta($post_id, '_date_debut', $_POST['date_debut']);
}

add_action('admin_init','customize_meta_boxes');

function customize_meta_boxes() {
     remove_meta_box('postcustom','reservation','normal');
}
