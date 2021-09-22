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
                PostConsoleUpdate("Processing Archetypes.json...");
                List<ArchetypeData> ATData = JsonConvert.DeserializeObject<List<ArchetypeData>>(File.ReadAllText(workingFolder + "\\Archetypes.json"));

                for (int i = 0; i < ATData.Count; i++)
                {
                    ATData[i].PrimaryGroup = FixATGRoupName(ATData[i].PrimaryGroup);
                    ATData[i].SecondaryGroup = FixATGRoupName(ATData[i].SecondaryGroup);
                }

                File.WriteAllText(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\Archetypes.json", JsonConvert.SerializeObject(ATData, Formatting.Indented));

                PostConsoleUpdate(string.Format("Processed {0} archetypes.", ATData.Count));
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
                PostConsoleUpdate("Processing PowerSets.json...");
                List<PowerSetData> powersetData = JsonConvert.DeserializeObject<List<PowerSetData>>(File.ReadAllText(workingFolder + "\\PowerSets.json"));

                for (int i = 0; i< powersetData.Count; i++)
                {
                    switch (powersetData[i].SetType)
                    {
                        case 1: // Primaries
                        case 2: // Secondaries
                        case 3: // Epics
                        case 4: // Inherents
                        case 5: // Pools
                        case 11: // Incarnates
                            powersetData[i].ShortName = GetShortPowersetName(powersetData[i].DisplayName);
                            powersetOutput.Add(powersetData[i]);
                            break;
                    }
                }

                File.WriteAllText(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\PowerSets.json", JsonConvert.SerializeObject(powersetOutput, Formatting.Indented));

                PostConsoleUpdate(string.Format("Processed {0} powersets, wrote {1}.", powersetData.Count, powersetOutput.Count));
            }
            else
            {
                PostConsoleUpdate("File not found - PowerSets.json");
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
        }

        private void btnConvert_Click(object sender, EventArgs e)
        {
            ProcessArchetypeFile();
            Refresh();
            ProcessPowersetFile();
        }
    }
}
