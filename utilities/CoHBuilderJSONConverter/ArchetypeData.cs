using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoHBuilderJSONConverter
{
    public class ArchetypeData
    {
        public int Idx;
        public string DisplayName;
        public int ClassType;
        public int Hitpoints;
        public double HPCap;
        public string DescLong;
        public string DescShort;
        public double ResCap;
        public double RechargeCap;
        public double DamageCap;
        public double RegenCap;
        public double RecoveryCap;
        public string[] Origin;
        public int[] Primary;
        public int[] Secondary;
        public int[] Ancillary;
        public double PerceptionCap;
        public string ClassName;
        //public int Column;
        public string PrimaryGroup;
        public string SecondaryGroup;
        public string EpicGroup;
        public bool Playable;
        public double BaseRecovery;
        public double BaseRegen;
        public double BaseThreat;
        public bool Hero;
    }
}
