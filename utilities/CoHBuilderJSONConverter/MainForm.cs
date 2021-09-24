using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;

namespace CoHBuilderJSONConverter
{
    public partial class MainForm : Form
    {
        protected string workingFolder = "";

        public MainForm()
        {
            InitializeComponent();
        }

        private void PostConsoleUpdate(string update)
        {
            if (txtConsole.Text.Length > 0)
                txtConsole.Text += Environment.NewLine;

            txtConsole.Text += update;

            Refresh();
        }

        private string FixATGRoupName(string groupName)
        {
            string[] parts = groupName.Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < parts.Length; i++)
            {
                parts[i] = parts[i].Substring(0, 1).ToUpper() + parts[i].Substring(1).ToLower();
            }

            return string.Join("_", parts);
        }
        private string GetShortPowersetName(string powersetName)
        {
            switch(powersetName)
            {
                case "Assault Rifle":
                    return "AR";
                case "Battle Axe":
                    return "Axe";
                case "Beam Rifle":
                    return "BR";
                case "Broad Sword":
                    return "BS";
                case "Devices":
                    return "Dev";
                case "Dual Blades":
                    return "DB";
                case "Dual Pistols":
                    return "Pistols";
                case "Empathy":
                    return "Emp";
                case "Force Field":
                    return "FF";
                case "Invulnerability":
                    return "Inv";
                case "Kinetic Melee":
                case "Kinetics":
                    return "Kin";
                case "Martial Arts":
                    return "MA";
                case "Mercenaries":
                    return "Merc";
                case "Necromancy":
                    return "Necro";
                case "Ninjitsu":
                    return "Nin";
                case "Regeneration":
                    return "Regen";
                case "Robotics":
                    return "Bot";
                case "Street Justice":
                    return "SJ";
                case "Super Reflexes":
                    return "SR";
                case "Super Strength":
                    return "SS";
                case "Tactical Arrow":
                case "Trick Arrow":
                    return "TA";
                case "Titan Weapons":
                    return "TW";
                case "War Mace":
                    return "Mace";
                case "Willpower":
                    return "WP";
                default:
                    string[] parts = powersetName.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                    if (parts.Length > 1)
                    {
                        if (parts[0].StartsWith("Darkness"))
                            return "Dark";
                        else if (parts[0].StartsWith("Elect"))
                            return "Elec";
                        else if (parts[0].StartsWith("Fiery"))
                            return "Fire";
                        else if (parts[0].StartsWith("Gravity"))
                            return "Grav";
                        else if (parts[0].StartsWith("Icy"))
                            return "Ice";
                        else if (parts[0].StartsWith("Illusion"))
                            return "Ill";
                        else if (parts[0].StartsWith("Ninja"))
                            return "Nin";
                        else if ((parts[0].StartsWith("Psy")) || (parts[0].StartsWith("Psi")))
                            return "Psi";
                        else if (parts[0].StartsWith("Radi"))
                            return "Rad";
                        else if (parts[0].StartsWith("Thorn"))
                            return "Thorn";
                        else
                            return parts[0];
                    }
                    else
                    {
                        return (parts.Length > 0) ? parts[0] : "";
                    }
            }
        }

        private void ProcessArchetypeFile()
        {
            if (File.Exists(workingFolder + "\\Archetypes.json"))
            {
                List<ArchetypeData> ATOutput = new List<ArchetypeData>();
                PostConsoleUpdate("Processing Archetypes.json...");
                List<ArchetypeData> ATData = JsonConvert.DeserializeObject<List<ArchetypeData>>(File.ReadAllText(workingFolder + "\\Archetypes.json"));

                for (int i = 0; i < ATData.Count; i++)
                {
                    if (ATData[i].Playable)
                    {
                        ATData[i].PrimaryGroup = FixATGRoupName(ATData[i].PrimaryGroup);
                        ATData[i].SecondaryGroup = FixATGRoupName(ATData[i].SecondaryGroup);
                        ATOutput.Add(ATData[i]);
                    }
                }

                File.WriteAllText(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\Archetypes.json", JsonConvert.SerializeObject(ATOutput, Formatting.Indented));

                PostConsoleUpdate(string.Format("Processed {0} archetypes, wrote {1}.", ATData.Count, ATOutput.Count));
            }
            else
            {
                PostConsoleUpdate("File not found - Archetypes.json");
            }
        }

        private void ProcessPowersetFile()
        {
            if (File.Exists(workingFolder + "\\PowerSets.json"))
            {
                List<PowerSetData> powersetOutput = new List<PowerSetData>();
                //List<PowerSetData> boostOutput = new List<PowerSetData>();
                PostConsoleUpdate("Processing PowerSets.json...");
                List<PowerSetData> powersetData = JsonConvert.DeserializeObject<List<PowerSetData>>(File.ReadAllText(workingFolder + "\\PowerSets.json"));

                for (int i = 0; i< powersetData.Count; i++)
                {
                    switch (powersetData[i].SetType)
                    {
                        case 1: // Primaries
                        case 2: // Secondaries
                        case 3: // Epics
                            powersetData[i].ShortName = GetShortPowersetName(powersetData[i].DisplayName);
                            powersetOutput.Add(powersetData[i]);
                            break;
                        case 4: // Inherents
                        case 5: // Pools
                        case 6: // Accolades
                        case 9: // Set Bonuses
                        case 11: // Incarnates
                            powersetOutput.Add(powersetData[i]);
                            break;
                        /*case 10: // Boosts
                            boostOutput.Add(powersetData[i]);
                            break;*/
                    }
                }

                File.WriteAllText(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\PowerSets.json", JsonConvert.SerializeObject(powersetOutput, Formatting.Indented));
                //File.WriteAllText(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\Boosts.json", JsonConvert.SerializeObject(boostOutput, Formatting.Indented));

                PostConsoleUpdate(string.Format("Processed {0} powersets, wrote {1}.", powersetData.Count, powersetOutput.Count)); //, boostOutput.Count));
            }
            else
            {
                PostConsoleUpdate("File not found - PowerSets.json");
            }
        }

        private void ExtractEnhancementSets()
        {
            if (File.Exists(workingFolder + "\\PowerSets.json"))
            {
                PostConsoleUpdate("Processing Database.json - This will be slow!!!");
                // DANGER - This cannot be used because it will throw an Out of Memory Exception!
                dynamic MidsDatabase = Newtonsoft.Json.Linq.JObject.Parse(File.ReadAllText(workingFolder + "\\Database.json"));
                var enhancementSets = MidsDatabase.EnhancementSets;
                File.WriteAllText(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\EnhancementSets.json", JsonConvert.SerializeObject(enhancementSets, Formatting.Indented));
            }
            else
            {
                PostConsoleUpdate("File not found - Database.json");
            }
    }

    private void btnBrowse_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog openMe = new FolderBrowserDialog();
            openMe.RootFolder = Environment.SpecialFolder.Desktop;
            openMe.ShowNewFolderButton = false;

            if (openMe.ShowDialog() == DialogResult.OK)
            {
                workingFolder = openMe.SelectedPath;
                txtFolderName.Text = workingFolder;
            }

            btnConvert.Enabled = !string.IsNullOrEmpty(workingFolder);
        }

        private void btnConvert_Click(object sender, EventArgs e)
        {
            ProcessArchetypeFile();
            ProcessPowersetFile();
            //ExtractEnhancementSets();
            PostConsoleUpdate("Done!");
        }
    }
}
